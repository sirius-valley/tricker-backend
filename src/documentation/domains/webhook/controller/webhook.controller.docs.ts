/**
 * @swagger
 * paths:
 *   /api/webhooks/{webhookId}:
 *     post:
 *       summary: Receives webhooks
 *       description: This endpoint receives webhooks from external services.
 *       tags:
 *         - Webhook
 *       parameters:
 *         - in: path
 *           name: webhookId
 *           required: true
 *           type: string
 *           description: The unique identifier of the registered webhook.
 *       responses:
 *         '200':
 *           description: Webhook received successfully
 *         '400':
 *           $ref: '#/components/responses/ValidationException'
 *         '404':
 *           $ref: '#/components/responses/NotFoundException'
 */
