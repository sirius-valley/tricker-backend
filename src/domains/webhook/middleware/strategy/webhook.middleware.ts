import { type WebhookSourceDTO } from '@domains/webhookSource';
import { type ExtendedRequest } from '@app';

export interface WebhookMiddleware {
  validateWebhookRequest: (req: ExtendedRequest, webhookSource: WebhookSourceDTO) => Promise<string>;
}
