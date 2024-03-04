import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository/pendingProjectAuthorization.repository';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import type { PendingProjectAuthorization, PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class PendingProjectAuthorizationRepositoryImpl implements PendingProjectAuthorizationRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

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
}
