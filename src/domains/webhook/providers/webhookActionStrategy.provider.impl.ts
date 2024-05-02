import { TrickerEntityType, WebhookActionType } from '@domains/webhook/dto';
import { NotImplementedException } from '@utils';
import { type WebhookActionStrategyProvider } from '@domains/webhook/providers/webhookActionStrategy.provider';
import { type WebhookActionStrategy } from '@domains/webhook/providers/webhookActionStrategy';
import { LoggerExampleStrategy } from '@domains/webhook/providers/loggerExampleStrategy';

const map = new Map<WebhookActionType, WebhookActionStrategy>([
  [WebhookActionType.CREATE, new LoggerExampleStrategy()],
  [WebhookActionType.UPDATE, new LoggerExampleStrategy()],
  [WebhookActionType.DELETE, new LoggerExampleStrategy()],
]);

const biggerMap = new Map<TrickerEntityType, Map<WebhookActionType, WebhookActionStrategy>>([[TrickerEntityType.ISSUE, map]]);

export class WebhookActionStrategyProviderImpl implements WebhookActionStrategyProvider {
  private readonly trickerEntityActionsMap: Map<TrickerEntityType, Map<WebhookActionType, WebhookActionStrategy>> = biggerMap;

  getStrategy(entityType: TrickerEntityType, actionType: WebhookActionType): WebhookActionStrategy {
    const stategiesMap = this.trickerEntityActionsMap.get(entityType);
    if (stategiesMap === undefined) throw new NotImplementedException('Entity not supported.');

    const strategy = stategiesMap.get(actionType);
    if (strategy === undefined) throw new NotImplementedException('Action not supported.');

    return strategy;
  }
}
