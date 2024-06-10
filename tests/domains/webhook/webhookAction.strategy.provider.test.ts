import { type WebhookActionStrategy, type WebhookActionStrategyProvider, WebhookActionStrategyProviderImpl } from '@domains/webhook/service';
import { TrickerEntityType, WebhookActionType } from '@domains/webhook/dto';
import { webhookActionStrategyMock } from '../../mock';
import { NotImplementedException } from '@utils';

describe('webhook action strategy provider tests', () => {
  let provider: WebhookActionStrategyProvider;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('WebhookActionStrategyProviderImpl tests', () => {
    let mockActionMap;

    beforeEach(() => {
      mockActionMap = new Map<WebhookActionType, WebhookActionStrategy>([
        [WebhookActionType.CREATE, webhookActionStrategyMock],
        [WebhookActionType.UPDATE, webhookActionStrategyMock],
      ]);
      provider = new WebhookActionStrategyProviderImpl(new Map([[TrickerEntityType.ISSUE, mockActionMap]]));
    });

    // Successful retrieval tests
    it('should get the correct strategy for a supported entity and action', () => {
      const entityType = TrickerEntityType.ISSUE;
      const actionType = WebhookActionType.CREATE;

      const strategy = provider.getStrategy(entityType, actionType);

      expect(strategy).toBe(webhookActionStrategyMock); // Verify the exact mock instance
    });

    it('should get the correct strategy for another supported action', () => {
      const entityType = TrickerEntityType.ISSUE;
      const actionType = WebhookActionType.UPDATE;

      const strategy = provider.getStrategy(entityType, actionType);

      expect(strategy).toBe(webhookActionStrategyMock); // Verify the exact mock instance
    });

    // Error handling tests
    it('should throw NotImplementedException for unsupported entity type', () => {
      const entityType = TrickerEntityType.ISSUE_CHANGE_LOG; // Unsupported entity type
      const actionType = WebhookActionType.CREATE;

      try {
        provider.getStrategy(entityType, actionType);
        fail('NotImplementedException excepted');
      } catch (e: any) {
        expect(e).toBeInstanceOf(NotImplementedException);
      }
    });

    it('should throw NotImplementedException for unsupported action type on a supported entity', () => {
      const entityType = TrickerEntityType.ISSUE;
      const actionType = WebhookActionType.DELETE; // Unsupported action type

      try {
        provider.getStrategy(entityType, actionType);
        fail('NotImplementedException excepted');
      } catch (e: any) {
        expect(e).toBeInstanceOf(NotImplementedException);
      }
    });
  });
});
