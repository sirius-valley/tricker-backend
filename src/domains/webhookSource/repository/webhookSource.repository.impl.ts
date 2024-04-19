import { type WebhookSourceRepository } from '@domains/webhookSource/repository/webhookSource.repository';
import { WebhookSourceDTO } from '@domains/webhookSource/dto';
import { type PrismaClient } from '@prisma/client';

export class WebhookSourceRepositoryImpl implements WebhookSourceRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Retrieves a webhook source by its dynamic route.
   * @param dynamicRoute The dynamic route of the webhook source to retrieve.
   * @returns A promise that resolves to a WebhookSourceDTO object if found, or null if not found.
   */
  async getByDynamicRoute(dynamicRoute: string): Promise<WebhookSourceDTO | null> {
    const webhookSource = await this.db.webhookSource.findUnique({
      where: {
        dynamicRoute,
      },
    });

    return webhookSource === null ? null : new WebhookSourceDTO(webhookSource);
  }
}
