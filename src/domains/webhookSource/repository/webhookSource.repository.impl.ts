import { type WebhookSourceRepository } from '@domains/webhookSource/repository/webhookSource.repository';
import { WebhookSourceDTO } from '@domains/webhookSource/dto';
import { type PrismaClient } from '@prisma/client';

export class WebhookSourceRepositoryImpl implements WebhookSourceRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Retrieves a webhook source by its id.
   * @param id The id route of the webhook source to retrieve.
   * @returns A promise that resolves to a WebhookSourceDTO object if found, or null if not found.
   */
  async getById(id: string): Promise<WebhookSourceDTO | null> {
    const webhookSource = await this.db.webhookSource.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    return webhookSource === null ? null : new WebhookSourceDTO(webhookSource);
  }
}
