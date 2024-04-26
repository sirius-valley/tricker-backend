import { type WebhookConverter } from '@domains/webhook/converter/webhook.converter';
import { type TrickerEntity, TrickerEntityType, type WebhookFullPayload } from '@domains/webhook/dto';

export class WebhookConverterLinear implements WebhookConverter {
  /**
   * Checks if the given issue provider name is supported.
   * @param issueProviderName The name of the issue provider to check.
   * @returns True if the issue provider is supported, otherwise false.
   */
  supports(issueProviderName: string): boolean {
    return issueProviderName === 'LINEAR';
  }

  /**
   * Asynchronously processes the webhook payload and returns a trigger entity.
   * @param input The webhook payload to process.
   * @returns A Promise that resolves to a trigger entity representing the processed payload.
   */
  async processWebhookPayload(input: WebhookFullPayload): Promise<TrickerEntity> {
    return Promise.resolve({ ...input, type: TrickerEntityType.ISSUE });
  }
}
