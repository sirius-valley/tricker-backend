import { type TrickerEntityType, type WebhookActionType } from '@domains/webhook/dto';
import { type WebhookActionStrategy } from '@domains/webhook/providers/webhookActionStrategy';

export interface WebhookActionStrategyProvider {
  getStrategy: (entityType: TrickerEntityType, actionType: WebhookActionType) => WebhookActionStrategy;
}
