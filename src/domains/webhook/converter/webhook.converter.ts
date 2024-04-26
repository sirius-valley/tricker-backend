import type { WebhookFullPayload } from '@domains/webhook/dto';

export interface WebhookConverter {
  supports: (issueProviderName: string) => boolean;
  processWebhookPayload: (input: WebhookFullPayload) => AsyncIterableIterator<void>;
}
