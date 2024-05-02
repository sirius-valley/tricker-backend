import { type TrickerEntityType, type WebhookActionType } from '@domains/webhook/dto';
import { type WebhookActionStrategy } from '@domains/webhook/providers/webhookActionStrategy';

export interface WebhookActionStrategyProvider {
  /**
   * Retrieves the appropriate webhook action strategy for the given entity type and action type.
   *
   * @param {TrickerEntityType} entityType - The type of entity involved in the webhook action.
   * @param {WebhookActionType} actionType - The type of action being performed on the entity (create, update, delete).
   * @returns {WebhookActionStrategy} The `WebhookActionStrategy` instance responsible for handling the webhook action.
   * @throws {NotImplementedException} - If the provided entity type or action type is not supported.
   */
  getStrategy: (entityType: TrickerEntityType, actionType: WebhookActionType) => WebhookActionStrategy;
}
