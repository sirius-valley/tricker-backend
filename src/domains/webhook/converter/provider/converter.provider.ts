import { type WebhookConverter } from '@domains/webhook/converter/webhook.converter';

export interface ConverterProvider {
  getConverter: (issueProviderName: string) => WebhookConverter;
}
