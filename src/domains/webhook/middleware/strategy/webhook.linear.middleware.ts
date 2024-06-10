import { type WebhookMiddleware } from '@domains/webhook/middleware/strategy/webhook.middleware';
import { Constants, decryptData, NodeEnv, verifyLinearSignature, WebhookValidationException } from '@utils';
import type { WebhookSourceDTO } from '@domains/webhookSource';
import { type ExtendedRequest } from '@app';

export class WebhookLinearMiddleware implements WebhookMiddleware {
  /**
   * Validates a webhook request.
   * @param req The request object.
   * @param webhookSource The webhook source data transfer object (DTO).
   * @returns A promise resolving to the signature string if the validation succeeds.
   * @throws {WebhookValidationException} Throws an error if the validation fails.
   */
  async validateWebhookRequest(req: ExtendedRequest, webhookSource: WebhookSourceDTO): Promise<string> {
    // Validate the request origin IP if the Production environment is being used
    if (Constants.NODE_ENV === NodeEnv.PROD && (req.ip === undefined || (req.ip !== '35.231.147.226' && req.ip !== '35.243.134.228'))) {
      throw new WebhookValidationException(400, 'Webhook request origin IP is not authorized.');
    }

    // Check if raw body is provided in the request
    if (req.rawBody === undefined) {
      throw new WebhookValidationException(400, 'No signature provided for the webhook payload.');
    }
    // Check if webhook source secret is null
    else if (webhookSource.secret === null) {
      throw new WebhookValidationException(400, 'Secret validation problem.');
    }

    // Decrypt the webhook source secret
    const decryptedSecret: string = decryptData(webhookSource.secret);

    // Verify signature using decrypted secret
    const signature = verifyLinearSignature({ decryptedSecret, rawBody: req.rawBody });
    if (signature !== req.headers['linear-signature']) {
      throw new WebhookValidationException(400, 'Payload signature invalid.');
    }
    return Promise.resolve(signature);
  }
}
