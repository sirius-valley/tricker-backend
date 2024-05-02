import { type WebhookService } from '@domains/webhook/service/webhook.service';
import { type ProviderWebhookRegistrationData, type WebhookSourceDTO, type WebhookSourceRepository } from '@domains/webhookSource';
import { randomUUID } from 'node:crypto';
import { type IssueProviderDTO, type IssueProviderRepository } from '@domains/issueProvider';
import { encryptData, NotFoundException } from '@utils';
import { type WebhookRegistrationStrategyProvider } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy.provider';
import { type WebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy';
import { WebhookActionType, WebhookPayloadType } from '../dto';
import { type Request } from 'express';
import { type EventRepository, type LogWebhooksDTO } from '@domains/event';
import { type WebhookConverterProvider } from '@domains/webhook/converter';
import { webhooksQueue } from '@utils/queue';
import { type WebhookActionStrategyProvider } from '@domains/webhook/providers';

/**
 * Generates a random UUID string to be used as a webhook ID.
 *
 * @returns {string} A random UUID string.
 */
export const generateWebhookId = (): string => {
  return randomUUID();
};

export class WebhookServiceImpl implements WebhookService {
  constructor(
    private readonly webhookSourceRepository: WebhookSourceRepository,
    private readonly issueProviderRepository: IssueProviderRepository,
    private readonly strategyProvider: WebhookRegistrationStrategyProvider,
    private readonly eventRepository: EventRepository,
    private readonly webhookConverterProvider: WebhookConverterProvider,
    private readonly webhookActionStrategyProvider: WebhookActionStrategyProvider
  ) {}

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
   * Saves a log in the db with the webhook's payload,
   * @param req The incoming request object containing the webhook data.
   * @returns A Promise that resolves to a LogWebhooksDTO representing the logged webhook.
   */
  async handleWebhookArrival(req: Request): Promise<LogWebhooksDTO> {
    const { webhookId } = req.params;

    const webhookSource: WebhookSourceDTO = await this.getWebhookSource(webhookId);
    const issueProvider: IssueProviderDTO = await this.getIssueProvider(webhookSource.issueProviderId);

    const webhookLog = await this.eventRepository.createLogWebhook({ payload: req.body, sourceId: webhookId, status: 'PENDING', providerEventId: req.body.webhookId });

    webhooksQueue.push(async () => {
      try {
        const converter = this.webhookConverterProvider.getWebhookConverter(issueProvider.name);
        const { eventType, eventAction } = this.prepareWebhookPayload(req, issueProvider.name);

        const entity = converter.convertWebhookPayload({
          eventType,
          webhookBody: req.body,
        });

        const actionPerformer = this.webhookActionStrategyProvider.getStrategy(entity.type, eventAction);
        const processEntity = await actionPerformer.perform(entity);
        await this.eventRepository.updateLogWebhook({ id: webhookLog.id, status: 'PROCESSED' });
        return processEntity;
      } catch (e: any) {
        await this.eventRepository.updateLogWebhook({ id: webhookLog.id, status: 'ERROR' });
        throw e;
      }
    });

    return webhookLog;
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

  /**
   * Prepares a WebhookPayloadType and a WebhookActionType based on the issue provider name.
   * @param req The incoming request object containing the webhook data.
   * @param issueProviderName The name of the issue provider.
   * @returns The type of the webhook payload.
   */
  private prepareWebhookPayload(req: Request, issueProviderName: string): { eventType: WebhookPayloadType; eventAction: WebhookActionType } {
    let eventType: WebhookPayloadType;
    let eventAction: WebhookActionType;
    switch (issueProviderName) {
      default: {
        const linearEvent: string = req.headers['linear-event'] as string;
        const linearAction: string = req.body.action as string;
        // we only have two event types for linear, if not IssueLabel, then it's Issue
        eventType = linearEvent === 'IssueLabel' ? WebhookPayloadType.LABEL : WebhookPayloadType.ISSUE;
        // we only have three actions in general, if not create, then it's update, if not update, then it can only be delete
        eventAction = linearAction === 'create' ? WebhookActionType.CREATE : linearAction === 'update' ? WebhookActionType.UPDATE : WebhookActionType.DELETE;
        break;
      }
    }

    return { eventType, eventAction };
  }
}
