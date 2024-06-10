import type { ProviderWebhookRegistrationData } from '@domains/webhookSource';
import { createApolloClient } from '@utils/graphql/apollo';
import { CreateWebhookMutation } from '@utils/graphql/queries';
import { type WebhookRegistrationStrategy } from '@domains/webhook/service/registration/provider/webhookRegistration.strategy';
import { NodeEnv } from '@utils';

export class LinearWebhookRegistrationStrategy implements WebhookRegistrationStrategy {
  /**
   * Checks if this strategy supports the specified issue provider.
   *
   * @param {string} issueProviderName - The name of the issue provider.
   * @returns {boolean} True if the provider is 'LINEAR', false otherwise.
   */
  supports(issueProviderName: string): boolean {
    return issueProviderName === 'LINEAR';
  }

  /**
   * Registers a webhook with the Linear issue provider using a GraphQL mutation.
   *
   * @param {object} input - The data required to register the webhook.
   * @param {string} input.providerApiKey - The API key provided by the Linear issue provider.
   * @param {string} input.providerProjectId - The project ID within the Linear system.
   * @param {string} input.trickerWebhookSourceId - The unique identifier of the Tricker webhook source.
   * @returns {Promise<ProviderWebhookRegistrationData>} A promise resolving to the registration data returned by the Linear API.
   */
  async registerWebhook(input: { providerApiKey: string; providerProjectId: string; trickerWebhookSourceId: string }): Promise<ProviderWebhookRegistrationData> {
    const apolloClient = createApolloClient(input.providerApiKey);

    const url = process.env.NODE_ENV === NodeEnv.DEV ? process.env.NGROK_STATIC_DOMAIN! : 'tricker.com.ar';

    const { data: mutationResult } = await apolloClient.mutate({
      mutation: CreateWebhookMutation,
      variables: {
        input: {
          label: `Tricker Project Integration`,
          allPublicTeams: false,
          resourceTypes: ['Issue', 'IssueLabel'],
          teamId: input.providerProjectId,
          url: `https://${url}/api/webhooks/${input.trickerWebhookSourceId}`,
        },
      },
    });

    return {
      id: mutationResult.webhookCreate.webhook.id,
      secret: mutationResult.webhookCreate.webhook.secret,
    };
  }
}
