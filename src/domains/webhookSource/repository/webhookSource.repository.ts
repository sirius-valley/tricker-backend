import { type WebhookSourceDTO } from '@domains/webhookSource/dto';

export interface WebhookSourceRepository {
  getById: (id: string) => Promise<WebhookSourceDTO | null>;
}
