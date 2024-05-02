import { TrickerEntityType, WebhookActionType } from '@domains/webhook/dto';
import { NotImplementedException } from '@utils';
import { type WebhookActionStrategyProvider } from '@domains/webhook/providers/webhookActionStrategy.provider';
import { type WebhookActionStrategy } from '@domains/webhook/providers/webhookActionStrategy';
import { LoggerExampleStrategy } from '@domains/webhook/providers/loggerExampleStrategy';

const innerIssueActionMap = new Map<WebhookActionType, WebhookActionStrategy>([
  [WebhookActionType.CREATE, new LoggerExampleStrategy()],
  [WebhookActionType.UPDATE, new LoggerExampleStrategy()],
  [WebhookActionType.DELETE, new LoggerExampleStrategy()],
]);

const outerActionMap = new Map<TrickerEntityType, Map<WebhookActionType, WebhookActionStrategy>>([[TrickerEntityType.ISSUE, innerIssueActionMap]]);

export class WebhookActionStrategyProviderImpl implements WebhookActionStrategyProvider {
  /**
   * A private map that stores the mapping between tricker entity types and their respective action strategies.
   *
   * The inner map associates webhook action types with their corresponding `WebhookActionStrategy` implementations.
   * This structure allows for efficient retrieval of the appropriate strategy based on the entity and action.
   */
  private readonly trickerEntityActionsMap: Map<TrickerEntityType, Map<WebhookActionType, WebhookActionStrategy>> = outerActionMap;

  getStrategy(entityType: TrickerEntityType, actionType: WebhookActionType): WebhookActionStrategy {
    const stategiesMap = this.trickerEntityActionsMap.get(entityType);
    if (stategiesMap === undefined) throw new NotImplementedException('Entity not supported.');

    const strategy = stategiesMap.get(actionType);
    if (strategy === undefined) throw new NotImplementedException('Action not supported.');

    return strategy;
  }
}
