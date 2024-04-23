import { type CustomRequest } from '@domains/webhook/middleware/webhooksMiddleware';
import { type WebhookSourceDTO } from '@domains/webhookSource';

export interface WebhookMiddleware {
  validateWebhookRequest: (req: CustomRequest, webhookSource: WebhookSourceDTO) => Promise<string>;
}
