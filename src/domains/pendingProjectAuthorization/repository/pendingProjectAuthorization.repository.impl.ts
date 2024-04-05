import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository/pendingProjectAuthorization.repository';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import type { PendingProjectAuthorization, PrismaClient } from '@prisma/client';

export class PendingProjectAuthorizationRepositoryImpl implements PendingProjectAuthorizationRepository {
  constructor(private readonly db: PrismaClient) {}

  async getByProjectId(providerProjectId: string): Promise<PendingProjectAuthorizationDTO | null> {
    const pendingProject: PendingProjectAuthorization | null = await this.db.pendingProjectAuthorization.findFirst({
      where: {
        providerProjectId,
      },
    });

    return pendingProject === null ? null : new PendingProjectAuthorizationDTO(pendingProject);
  }

  async delete(id: string): Promise<PendingProjectAuthorizationDTO> {
    const pendingProject: PendingProjectAuthorization = await this.db.pendingProjectAuthorization.delete({
      where: {
        id,
      },
    });

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
      },
      data: {
        isIntegrating: data.isIntegrating,
      },
    });

    return new PendingProjectAuthorizationDTO(pendingProject);
  }
}
