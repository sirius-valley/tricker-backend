import type { ProviderWebhookRegistrationData } from '@domains/webhookSource';

export interface WebhookRegistrationStrategy {
  /**
   * Checks if the strategy supports the specified issue provider.
   *
   * @param {string} issueProviderName - The name of the issue provider.
   * @returns {boolean} True if the strategy supports the issue provider, false otherwise.
   */
  supports: (issueProviderName: string) => boolean;

  /**
   * Registers a webhook with the specified issue provider.
   *
   * @param {object} input - The data required to register the webhook.
   * @param {string} input.providerApiKey - The API key provided by the issue provider.
   * @param {string} input.providerProjectId - The project ID within the issue provider platform.
   * @param {string} input.trickerWebhookSourceId - The unique identifier of the Tricker webhook source.
   * @returns {Promise<ProviderWebhookRegistrationData>} A promise resolving to the registration data returned by the issue provider.
   */
  registerWebhook: (input: { providerApiKey: string; providerProjectId: string; trickerWebhookSourceId: string }) => Promise<ProviderWebhookRegistrationData>;
}
