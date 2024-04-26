import { type ConverterProvider } from '@domains/webhook/converter/factory/converter.provider';
import { type WebhookConverter } from '@domains/webhook/converter/webhook.converter';
import { WebhookConverterLinear } from '@domains/webhook/converter/webhook.converter.linear';

const linearConverter: WebhookConverterLinear = new WebhookConverterLinear();
export class ConverterProviderImpl implements ConverterProvider {
  constructor(private readonly webhookConverters: WebhookConverter[]) {
    this.webhookConverters = [linearConverter];
  }

  getConverter(issueProviderName: string): WebhookConverter {
    const converter: WebhookConverter | undefined = this.webhookConverters.find((converter) => converter.supports(issueProviderName));
    if (converter === undefined) throw new Error('No webhook converter available for the chosen Issue Provider. Issue Provider not supported.');

    return converter;
  }
}
