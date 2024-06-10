import { type WebhookRegistrationStrategy } from '@domains/webhook/service/registration/provider/webhookRegistration.strategy';
import { LinearWebhookRegistrationStrategy } from '@domains/webhook/service/registration/webhookRegistration.linear.strategy.impl';
import { InternalServerErrorException } from '@utils';

export class WebhookRegistrationStrategyProvider {
  private readonly strategies: WebhookRegistrationStrategy[] = [new LinearWebhookRegistrationStrategy()];

  /**
   * Retrieves the appropriate webhook registration strategy based on the issue provider name.
   *
   * @param {string} issueProviderName - The name of the issue provider.
   * @returns {WebhookRegistrationStrategy} The strategy responsible for the specified issue provider.
   * @throws {InternalServerErrorException} If no strategy is found for the provided issue provider name.
   */
  getStrategy(issueProviderName: string): WebhookRegistrationStrategy {
    const strategy: WebhookRegistrationStrategy | undefined = this.strategies.find((strategy) => strategy.supports(issueProviderName));
    if (strategy === undefined) throw new InternalServerErrorException('No provider found for Webhook Registration.');
    return strategy;
  }
}
