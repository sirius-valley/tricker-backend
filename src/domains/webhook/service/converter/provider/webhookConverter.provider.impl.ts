import { type WebhookConverterProvider } from '@domains/webhook/service/converter/provider/webhookConverter.provider';
import { type WebhookConverter } from '@domains/webhook/service/converter/webhook.converter';
import { WebhookConverterLinear } from '@domains/webhook/service/converter/webhook.converter.linear';
import { NotImplementedException } from '@utils';

export class WebhookConverterProviderImpl implements WebhookConverterProvider {
  constructor(private readonly converters: WebhookConverter[]) {}

  /**
   * Retrieves a webhook converter based on the given issue provider name.
   * @param issueProviderName The name of the issue provider for which to retrieve the converter.
   * @returns The webhook converter associated with the specified issue provider.
   * @throws Error if no webhook converter is available for the chosen issue provider.
   */
  getWebhookConverter(issueProviderName: string): WebhookConverter {
    const converter: WebhookConverter | undefined = this.converters.find((converter) => converter.supports(issueProviderName));
    if (converter === undefined) throw new NotImplementedException('No webhook converter available for the chosen Issue Provider. Issue Provider not supported.');

    return converter;
  }
}

const linearConverter: WebhookConverterLinear = new WebhookConverterLinear();

export const webhookConverterProviderImplInstance = new WebhookConverterProviderImpl([linearConverter]);
