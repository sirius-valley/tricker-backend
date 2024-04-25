import type { ProviderWebhookRegistrationData } from '@domains/webhookSource';
import { createApolloClient } from '@utils/graphql/apollo';
import { CreateWebhookMutation } from '@utils/graphql/queries';
import { type WebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistrationStrategy';
import { NodeEnv } from '@utils';

export class LinearWebhookRegistrationStrategy implements WebhookRegistrationStrategy {
  supports(issueProviderName: string): boolean {
    return issueProviderName === 'LINEAR';
  }

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
