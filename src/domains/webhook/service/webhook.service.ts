import { type WebhookSourceDTO } from '@domains/webhookSource';
import { type WebhookConfirmationDTO, type WebhookFullPayload } from '@domains/webhook/dto';

export interface WebhookService {
  createWebhook: (input: { apiKey: string; projectId: string; providerProjectId: string; issueProviderName: string }) => Promise<WebhookSourceDTO>;
  handleWebhookArrival: (input: WebhookFullPayload) => Promise<WebhookConfirmationDTO>;
}
