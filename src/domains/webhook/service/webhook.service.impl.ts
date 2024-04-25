import { type WebhookService } from '@domains/webhook/service/webhook.service';
import { type ProviderWebhookRegistrationData, type WebhookSourceDTO, type WebhookSourceRepository } from '@domains/webhookSource';
import { randomUUID } from 'node:crypto';
import { type IssueProviderDTO, type IssueProviderRepository } from '@domains/issueProvider';
import { encryptData, NotFoundException } from '@utils';
import { type WebhookRegistrationStrategyProvider } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy.provider';
import { type WebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy';

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
    private readonly strategyProvider: WebhookRegistrationStrategyProvider
  ) {}

  /**
   * Creates a new webhook source.
   *
   * This method retrieves the issue provider, registrates the webhook is the issue provider platform,
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
}
