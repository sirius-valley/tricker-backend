import { type WebhookSourceDTO } from '@domains/webhookSource';

export interface WebhookService {
  createWebhook: (apiKey: string, projectId: string, providerProjectId: string, issueProviderId: string) => Promise<WebhookSourceDTO>;
}
