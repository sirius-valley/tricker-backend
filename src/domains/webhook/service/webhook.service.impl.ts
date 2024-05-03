import { type WebhookService } from '@domains/webhook/service/webhook.service';
import { type ProviderWebhookRegistrationData, type WebhookSourceDTO, type WebhookSourceRepository } from '@domains/webhookSource';
import { randomUUID } from 'node:crypto';
import { type IssueProviderDTO, type IssueProviderRepository } from '@domains/issueProvider';
import { encryptData, Logger, NotFoundException, WebhooksProcessingException } from '@utils';
import { type WebhookRegistrationStrategyProvider } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy.provider';
import { type WebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy';
import { type Request } from 'express';
import { type EventRepository } from '@domains/event';
import { type WebhookProcessor } from '@domains/webhook/service/webhook.processor';
import Queue from 'queue';

/**
 * Generates a random UUID string to be used as a webhook ID.
 *
 * @returns {string} A random UUID string.
 */
export const generateWebhookId = (): string => {
  return randomUUID();
};

export class WebhookServiceImpl implements WebhookService {
  private readonly queue: Queue;

  constructor(
    private readonly webhookSourceRepository: WebhookSourceRepository,
    private readonly issueProviderRepository: IssueProviderRepository,
    private readonly strategyProvider: WebhookRegistrationStrategyProvider,
    private readonly eventRepository: EventRepository,
    private readonly webhookProcessor: WebhookProcessor
  ) {
    this.queue = new Queue({ autostart: true });
    this.queue.addListener('error', async (e) => this.manageWebhookError(e));
  }

  async manageWebhookError(e: any): Promise<void> {
    if (e instanceof WebhooksProcessingException) {
      await this.eventRepository.createLogWebhook({
        payload: e.payload,
        sourceId: e.webhookSource.id,
        status: 'ERROR',
      });
    }
  }

  /**
   * Creates a new webhook source.
   *
   * This method retrieves the issue provider, registers the webhook is the issue provider platform,
   * encrypts the secret, and then saves the webhook information (Webhook Source) in the repository.
   *
   * @param {object} input - The data required to create the webhook.
   * @param {string} input.apiKey - The API key issued by the issue provider.
   * @param {string} input.projectId - The project ID associated with the webhook.
   * @param {string} input.providerProjectId - The project ID within the issue provider platform.
   * @param {string} input.issueProviderName - The name of the issue provider.
   * @returns {Promise<WebhookSourceDTO>} A promise resolving to the created WebhookSourceDTO.
   * @throws {NotFoundException} If the specified issue provider is not found.
   */
  async createWebhook(input: { apiKey: string; projectId: string; providerProjectId: string; issueProviderName: string }): Promise<WebhookSourceDTO> {
    const generatedWebhookId = generateWebhookId();

    const issueProvider: IssueProviderDTO | null = await this.issueProviderRepository.getByName(input.issueProviderName);
    if (issueProvider == null) throw new NotFoundException('Issue Provider');

    const webhookRegistrationStrategy: WebhookRegistrationStrategy = this.strategyProvider.getStrategy(issueProvider.name);
    const webhookRegistrationData: ProviderWebhookRegistrationData = await webhookRegistrationStrategy.registerWebhook({
      providerApiKey: input.apiKey,
      providerProjectId: input.providerProjectId,
      trickerWebhookSourceId: generatedWebhookId,
    });

    return await this.webhookSourceRepository.create({
      id: generatedWebhookId,
      secret: encryptData(webhookRegistrationData.secret),
      providerWebhookId: webhookRegistrationData.id,
      issueProviderId: issueProvider.id,
      projectId: input.projectId,
    });
  }

  /**
   * Handles the arrival of a webhook request.
   * Saves a log in the db with the webhook's payload, process the payload and perform actions in db.
   * @param req The incoming request object containing the webhook data.
   * @returns A Promise that resolves to a LogWebhooksDTO representing the logged webhook.
   */
  async handleWebhookArrival(req: Request): Promise<void> {
    const { webhookId } = req.params;

    const webhookSource: WebhookSourceDTO = await this.getWebhookSource(webhookId);
    const issueProvider: IssueProviderDTO = await this.getIssueProvider(webhookSource.issueProviderId);

    this.queue.push(async () => {
      try {
        const result = await this.webhookProcessor.process(req, issueProvider.name);
        await this.eventRepository.createLogWebhook({
          payload: req.body,
          sourceId: webhookId,
          status: 'PROCESSED',
        });
        return result;
      } catch (e: any) {
        Logger.error(e);
        Logger.error(e.stack);
        throw new WebhooksProcessingException(webhookSource, req.body, e.message as string);
      }
    });
  }

  /**
   * Retrieves the webhook source by ID.
   * @param webhookId The ID of the webhook source to retrieve.
   * @returns A Promise that resolves to the webhook source DTO.
   * @throws NotFoundException if the webhook source is not found or has been deleted.
   */
  private async getWebhookSource(webhookId: string): Promise<WebhookSourceDTO> {
    const webhookSource: WebhookSourceDTO | null = await this.webhookSourceRepository.getById(webhookId);
    if (webhookSource === null || webhookSource.deletedAt !== null) {
      throw new NotFoundException('WebhookSource');
    }

    return webhookSource;
  }

  /**
   * Retrieves the issue provider by ID.
   * @param issueProviderId The ID of the issue provider to retrieve.
   * @returns A Promise that resolves to the issue provider DTO.
   * @throws NotFoundException if the issue provider is not found.
   */
  private async getIssueProvider(issueProviderId: string): Promise<IssueProviderDTO> {
    const issueProvider: IssueProviderDTO | null = await this.issueProviderRepository.getById(issueProviderId);
    if (issueProvider == null) throw new NotFoundException('Issue Provider');

    return issueProvider;
  }
}
