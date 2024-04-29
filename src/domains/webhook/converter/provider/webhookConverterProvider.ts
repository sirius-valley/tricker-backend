import { type WebhookConverter } from '@domains/webhook/converter/webhook.converter';

export interface WebhookConverterProvider {
  getWebhookConverter: (issueProviderName: string) => WebhookConverter;
}
