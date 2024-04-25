import { type WebhookSourceDTO } from '@domains/webhookSource';

export interface WebhookService {
  createWebhook: (input: { apiKey: string; projectId: string; providerProjectId: string; issueProviderName: string }) => Promise<WebhookSourceDTO>;
}
