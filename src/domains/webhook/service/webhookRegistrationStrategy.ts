import type { ProviderWebhookRegistrationData } from '@domains/webhookSource';

export interface WebhookRegistrationStrategy {
  supports: (issueProviderName: string) => boolean;
  registerWebhook: (providerApiKey: string, providerProjectId: string, trickerWebhookSourceId: string) => Promise<ProviderWebhookRegistrationData>;
}
