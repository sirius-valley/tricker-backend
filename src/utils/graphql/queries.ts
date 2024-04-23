import { gql } from '@apollo/client';

export const CreateWebhookMutation = gql`
  mutation CreateWebhook($input: WebhookCreateInput!) {
    webhookCreate(input: $input) {
      success
      webhook {
        secret
        id
        enabled
      }
    }
  }
`;
