import { type WebhookService } from '@domains/webhook/service/webhook.service';
import { type ProviderWebhookRegistrationData, type WebhookSourceDTO, type WebhookSourceRepository } from '@domains/webhookSource';
import { randomUUID } from 'node:crypto';
import { type IssueProviderDTO, type IssueProviderRepository } from '@domains/issueProvider';
import { encryptData, NotFoundException } from '@utils';
import { type WebhookRegistrationStrategyProvider } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy.provider';
import { type WebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy';
import { type WebhookConfirmationDTO, type WebhookFullPayload, WebhookPayloadType } from '../dto';

export const generateWebhookId = (): string => {
  return randomUUID();
};

export class WebhookServiceImpl implements WebhookService {
  constructor(
    private readonly webhookSourceRepository: WebhookSourceRepository,
    private readonly issueProviderRepository: IssueProviderRepository,
    private readonly strategyProvider: WebhookRegistrationStrategyProvider
  ) {}

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

  async handleWebhookArrival(input: WebhookFullPayload): Promise<WebhookConfirmationDTO> {
    const webhookSource: WebhookSourceDTO = await this.getWebhookSource(input.webhookId);
    const issueProvider: IssueProviderDTO = await this.getIssueProvider(webhookSource.issueProviderId);

    // const webhookRegistrationStrategy: WebhookRegistrationStrategy = this.strategyProvider.getStrategy(issueProvider.name);

    return { eventType: WebhookPayloadType.LABEL, issueProvider };
  }

  private async getWebhookSource(webhookId: string): Promise<WebhookSourceDTO> {
    const webhookSource: WebhookSourceDTO | null = await this.webhookSourceRepository.getById(webhookId);
    if (webhookSource === null || webhookSource.deletedAt !== null) {
      throw new NotFoundException('WebhookSource');
    }

    return webhookSource;
  }

  private async getIssueProvider(issueProviderId: string): Promise<IssueProviderDTO> {
    const issueProvider: IssueProviderDTO | null = await this.issueProviderRepository.getById(issueProviderId);
    if (issueProvider == null) throw new NotFoundException('Issue Provider');

    return issueProvider;
  }
}
