import { type WebhookSourceDTO } from '@domains/webhookSource';
import { ExtendedRequest } from '@app';

export interface WebhookMiddleware {
  validateWebhookRequest: (req: ExtendedRequest, webhookSource: WebhookSourceDTO) => Promise<string>;
}
