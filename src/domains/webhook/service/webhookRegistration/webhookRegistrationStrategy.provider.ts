import { type WebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy';
import { LinearWebhookRegistrationStrategy } from '@domains/webhook/service/webhookRegistration/webhookRegistrationStrategy.linear.impl';

export class WebhookRegistrationStrategyProvider {
  private readonly strategies: WebhookRegistrationStrategy[] = [new LinearWebhookRegistrationStrategy()];

  getStrategy(issueProviderName: string): WebhookRegistrationStrategy {
    const strategy: WebhookRegistrationStrategy | undefined = this.strategies.find((strategy) => strategy.supports(issueProviderName));
    if (strategy === undefined) throw new Error('No provider found for Webhook Registration.');
    return strategy;
  }
}
