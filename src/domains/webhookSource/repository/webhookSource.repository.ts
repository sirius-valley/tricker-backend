import { type WebhookSourceDTO } from '@domains/webhookSource/dto';

export interface WebhookSourceRepository {
  getByDynamicRoute: (dynamicRoute: string) => Promise<WebhookSourceDTO | null>;
}
