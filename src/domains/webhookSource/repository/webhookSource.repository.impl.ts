import { type WebhookSourceRepository } from '@domains/webhookSource/repository/webhookSource.repository';
import { type WebhookSourceCreateInput, WebhookSourceDTO } from '@domains/webhookSource/dto';
import { type PrismaClient } from '@prisma/client';

export class WebhookSourceRepositoryImpl implements WebhookSourceRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(input: WebhookSourceCreateInput): Promise<WebhookSourceDTO> {
    const webhookSource = await this.db.webhookSource.create({
      data: {
        id: input.id,
        secret: input.secret,
        providerWebhookId: input.providerWebhookId,
        issueProviderId: input.issueProviderId,
        projectId: input.projectId,
      },
    });

    return new WebhookSourceDTO(webhookSource);
  }

  /**
   * Retrieves a webhook source by its id.
   * @param id The id route of the webhook source to retrieve.
   * @returns A promise that resolves to a WebhookSourceDTO object if found, or null if not found.
   */
  async getById(id: string): Promise<WebhookSourceDTO | null> {
    const webhookSource = await this.db.webhookSource.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    return webhookSource === null ? null : new WebhookSourceDTO(webhookSource);
  }
}
