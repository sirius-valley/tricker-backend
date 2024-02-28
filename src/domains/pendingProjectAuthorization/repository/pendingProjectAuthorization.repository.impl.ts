import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository/pendingProjectAuthorization.repository';
import { PendingProjectAuthorizationDTO, type PendingProjectInputDTO } from '@domains/pendingProjectAuthorization/dto';
import type { PendingProjectAuthorization, PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class PendingProjectAuthorizationRepositoryImpl implements PendingProjectAuthorizationRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(data: PendingProjectInputDTO): Promise<PendingProjectAuthorizationDTO> {
    const pendingProject: PendingProjectAuthorization = await this.db.pendingProjectAuthorization.create({
      data: {
        providerProjectId: data.providerProjectId,
        token: data.token,
        issueProviderId: data.issueProviderId,
        integratorId: data.integratorId,
        organizationId: data.organizationId,
      },
    });

    return new PendingProjectAuthorizationDTO(pendingProject);
  }

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
