import type { WebhookFullPayload } from '@domains/webhook/dto';

export interface WebhookAdapter<T> {
  adaptWebhookPayload: (input: WebhookFullPayload) => Promise<T>;
}
