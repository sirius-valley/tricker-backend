import { type WebhookConverterProvider } from '@domains/webhook/service/converter/provider/webhookConverter.provider';
import { type WebhookConverter } from '@domains/webhook/service/converter/webhook.converter';
import { WebhookConverterLinear } from '@domains/webhook/service/converter/webhook.converter.linear';

const linearConverter: WebhookConverterLinear = new WebhookConverterLinear();
export class WebhookConverterProviderImpl implements WebhookConverterProvider {
  private readonly converters: WebhookConverter[] = [linearConverter];

  /**
   * Retrieves a webhook converter based on the given issue provider name.
   * @param issueProviderName The name of the issue provider for which to retrieve the converter.
   * @returns The webhook converter associated with the specified issue provider.
   * @throws Error if no webhook converter is available for the chosen issue provider.
   */
  getWebhookConverter(issueProviderName: string): WebhookConverter {
    const converter: WebhookConverter | undefined = this.converters.find((converter) => converter.supports(issueProviderName));
    if (converter === undefined) throw new Error('No webhook converter available for the chosen Issue Provider. Issue Provider not supported.');

    return converter;
  }
}
