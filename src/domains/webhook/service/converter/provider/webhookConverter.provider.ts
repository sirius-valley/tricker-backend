import { type WebhookConverter } from '@domains/webhook/service/converter/webhook.converter';

export interface WebhookConverterProvider {
  getWebhookConverter: (issueProviderName: string) => WebhookConverter;
}
