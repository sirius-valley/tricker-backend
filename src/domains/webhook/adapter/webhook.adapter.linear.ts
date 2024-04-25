import { type WebhookAdapter } from '@domains/webhook/adapter/webhook.adapter';
import { type WebhookFullPayload } from '@domains/webhook/dto';

export class WebhookAdapterLinear implements WebhookAdapter<any> {
  async adaptWebhookPayload(input: WebhookFullPayload): Promise<any> {
    return Promise.resolve(undefined);
  }
}
