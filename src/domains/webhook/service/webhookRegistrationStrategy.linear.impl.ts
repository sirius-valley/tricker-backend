import type { ProviderWebhookRegistrationData } from '@domains/webhookSource';
import { createApolloClient } from '@utils/graphql/apollo';
import { CreateWebhookMutation } from '@utils/graphql/queries';
import { type WebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistrationStrategy';

export class LinearWebhookRegistrationStrategy implements WebhookRegistrationStrategy {
  supports(issueProviderName: string): boolean {
    return issueProviderName.toUpperCase().trim() === 'LINEAR';
  }

  async registerWebhook(providerApiKey: string, providerProjectId: string, trickerWebhookSourceId: string): Promise<ProviderWebhookRegistrationData> {
    const apolloClient = createApolloClient(providerApiKey);

    const { data } = await apolloClient.mutate({
      mutation: CreateWebhookMutation,
      variables: {
        input: {
          allPublicTeams: false,
          resourceTypes: ['Issue'],
          teamId: providerProjectId,
          url: `https://tricker.com.ar/api/webhooks/${trickerWebhookSourceId}`,
        },
      },
    });

    return {
      id: data.id,
      secret: data.secret,
    };
  }
}
