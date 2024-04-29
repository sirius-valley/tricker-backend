import type { TrickerEntity, WebhookFullPayload } from '@domains/webhook/dto';

export interface WebhookConverter {
  supports: (issueProviderName: string) => boolean;
  processWebhookPayload: (input: WebhookFullPayload) => Promise<TrickerEntity>;
}
