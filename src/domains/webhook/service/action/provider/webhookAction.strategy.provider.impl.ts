import { TrickerEntityType, WebhookActionType } from '@domains/webhook/dto';
import { NotImplementedException } from '@utils';
import { type WebhookActionStrategyProvider } from '@domains/webhook/service/action/provider/webhookAction.strategy.provider';
import { type WebhookActionStrategy } from '@domains/webhook/service/action/webhookAction.strategy';
import { LoggerExampleStrategy } from '@domains/webhook/service/action/loggerExample.strategy';

export class WebhookActionStrategyProviderImpl implements WebhookActionStrategyProvider {
  /**
   * A private map that stores the mapping between tricker entity types and their respective action strategies.
   *
   * The inner map associates webhook action types with their corresponding `WebhookActionStrategy` implementations.
   * This structure allows for efficient retrieval of the appropriate strategy based on the entity and action.
   */
  constructor(private readonly trickerEntityActionsMap: Map<TrickerEntityType, Map<WebhookActionType, WebhookActionStrategy>>) {}

  getStrategy(entityType: TrickerEntityType, actionType: WebhookActionType): WebhookActionStrategy {
    const stategiesMap = this.trickerEntityActionsMap.get(entityType);
    if (stategiesMap === undefined) throw new NotImplementedException('Entity not supported.');

    const strategy = stategiesMap.get(actionType);
    if (strategy === undefined) throw new NotImplementedException('Action not supported.');

    return strategy;
  }
}

const innerIssueActionMap = new Map<WebhookActionType, WebhookActionStrategy>([
  [WebhookActionType.CREATE, new LoggerExampleStrategy()],
  [WebhookActionType.UPDATE, new LoggerExampleStrategy()],
  [WebhookActionType.DELETE, new LoggerExampleStrategy()],
]);

const outerActionMap = new Map<TrickerEntityType, Map<WebhookActionType, WebhookActionStrategy>>([[TrickerEntityType.ISSUE, innerIssueActionMap]]);

export const webhookActionStrategyProviderImplInstance = new WebhookActionStrategyProviderImpl(outerActionMap);
