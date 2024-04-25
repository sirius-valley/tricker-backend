import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository/pendingProjectAuthorization.repository';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import type { PendingProjectAuthorization, PrismaClient } from '@prisma/client';

export class PendingProjectAuthorizationRepositoryImpl implements PendingProjectAuthorizationRepository {
  constructor(private readonly db: PrismaClient) {}

  async getByProjectId(providerProjectId: string): Promise<PendingProjectAuthorizationDTO | null> {
    const pendingProject: PendingProjectAuthorization | null = await this.db.pendingProjectAuthorization.findFirst({
      where: {
        providerProjectId,
        deletedAt: null,
      },
    });

    return pendingProject === null ? null : new PendingProjectAuthorizationDTO(pendingProject);
  }

  async delete(id: string): Promise<PendingProjectAuthorizationDTO> {
    const deletedPendingProject = this.db.pendingProjectAuthorization.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        token: null,
        isIntegrating: false,
      },
    });

    const deletedMemberEmails = this.db.memberEmail.updateMany({
      where: {
        pendingProjectAuthorizationId: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    const [, pendingProject] = await this.db.$transaction([deletedMemberEmails, deletedPendingProject]);

    return new PendingProjectAuthorizationDTO(pendingProject);
  }

  /**
   * Updates a pending project authorization record in the database.
   * @param data An object containing the pending project ID and a boolean indicating whether it is integrating or not.
   * @returns A Promise resolving to a PendingProjectAuthorizationDTO object representing the updated pending project.
   */
  async update(data: { pendingProjectId: string; isIntegrating: boolean }): Promise<PendingProjectAuthorizationDTO> {
    const pendingProject = await this.db.pendingProjectAuthorization.update({
      where: {
        id: data.pendingProjectId,
        deletedAt: null,
      },
      data: {
        isIntegrating: data.isIntegrating,
      },
    });

    return new PendingProjectAuthorizationDTO(pendingProject);
  }
}
