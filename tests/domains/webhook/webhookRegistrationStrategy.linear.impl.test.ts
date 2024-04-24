import { LinearWebhookRegistrationStrategy, type WebhookRegistrationStrategy } from '@domains/webhook/service';
import * as apollo from '@utils/graphql/apollo';
import { NodeEnv } from '@utils';
import { mock, type MockProxy } from 'jest-mock-extended';
import { type ApolloClient, type NormalizedCacheObject } from '@apollo/client/core';
import { CreateWebhookMutation } from '@utils/graphql/queries';

describe('webhook registration strategy tests', () => {
  let strategy: WebhookRegistrationStrategy;
  const mockMutationResult = {
    data: {
      webhookCreate: {
        webhook: {
          id: 'linear-webhook-id',
          secret: 'shhh',
        },
      },
    },
  };

  beforeEach(() => {
    strategy = new LinearWebhookRegistrationStrategy();
    jest.resetAllMocks();
  });

  it('supports Linear issue provider', () => {
    expect(strategy.supports('LINEAR')).toBeTruthy();
    expect(strategy.supports('linear')).toBeFalsy();
    expect(strategy.supports('jira')).toBeFalsy();
  });

  it('registers webhook with Linear GraphQL mutation', async () => {
    const providerApiKey = 'some-api-key';
    const providerProjectId = 'linear-project-id';
    const trickerWebhookSourceId = 'tricker-webhook-id';
    const expectedUrl = process.env.NODE_ENV === NodeEnv.DEV ? process.env.NGROK_STATIC_DOMAIN! : 'tricker.com.ar';

    const apolloClientMock: MockProxy<ApolloClient<NormalizedCacheObject>> = mock<ApolloClient<NormalizedCacheObject>>();
    const spiedApolloClientCreation = jest.spyOn(apollo, 'createApolloClient').mockReturnValueOnce(apolloClientMock);
    apolloClientMock.mutate.mockResolvedValue(mockMutationResult);

    const registrationData = await strategy.registerWebhook(providerApiKey, providerProjectId, trickerWebhookSourceId);

    expect(spiedApolloClientCreation).toHaveBeenCalledWith(providerApiKey);
    expect(apolloClientMock.mutate).toHaveBeenCalledWith({
      mutation: CreateWebhookMutation,
      variables: {
        input: {
          label: `Tricker Project Integration`,
          allPublicTeams: false,
          resourceTypes: ['Issue', 'IssueLabel'],
          teamId: providerProjectId,
          url: `https://${expectedUrl}/api/webhooks/${trickerWebhookSourceId}`,
        },
      },
    });

    expect(registrationData).toEqual({
      id: 'linear-webhook-id',
      secret: 'shhh',
    });
  });
});
