import { type ConverterProvider } from '@domains/webhook/converter/provider/converter.provider';
import { type WebhookConverter } from '@domains/webhook/converter/webhook.converter';
import { WebhookConverterLinear } from '@domains/webhook/converter/webhook.converter.linear';

const linearConverter: WebhookConverterLinear = new WebhookConverterLinear();
export class ConverterProviderImpl implements ConverterProvider {
  constructor(private readonly webhookConverters: WebhookConverter[]) {
    this.webhookConverters = [linearConverter];
  }

  /**
   * Retrieves a webhook converter based on the given issue provider name.
   * @param issueProviderName The name of the issue provider for which to retrieve the converter.
   * @returns The webhook converter associated with the specified issue provider.
   * @throws Error if no webhook converter is available for the chosen issue provider.
   */
  getConverter(issueProviderName: string): WebhookConverter {
    const converter: WebhookConverter | undefined = this.webhookConverters.find((converter) => converter.supports(issueProviderName));
    if (converter === undefined) throw new Error('No webhook converter available for the chosen Issue Provider. Issue Provider not supported.');

    return converter;
  }
}
