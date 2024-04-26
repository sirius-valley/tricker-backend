import { type WebhookSourceDTO } from '@domains/webhookSource';
import { type WebhookConfirmationDTO } from '@domains/webhook/dto';
import { type Request } from 'express';

export interface WebhookService {
  createWebhook: (input: { apiKey: string; projectId: string; providerProjectId: string; issueProviderName: string }) => Promise<WebhookSourceDTO>;
  handleWebhookArrival: (req: Request) => Promise<WebhookConfirmationDTO>;
}
