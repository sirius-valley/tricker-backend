import { type WebhookConverter } from '@domains/webhook/converter/webhook.converter';
import { type WebhookFullPayload } from '@domains/webhook/dto';

export class WebhookConverterLinear implements WebhookConverter {
  supports(issueProviderName: string): boolean {
    return issueProviderName === 'LINEAR';
  }

  async *processWebhookPayload(input: WebhookFullPayload): AsyncIterableIterator<void> {
    return undefined;
  }
}
