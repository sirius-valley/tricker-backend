import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository/pendingProjectAuthorization.repository';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import type { PendingProjectAuthorization, PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { type AuthorizationRequest } from '@domains/integration/dto';
import { encryptData } from '@utils';

export class PendingProjectAuthorizationRepositoryImpl implements PendingProjectAuthorizationRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(input: AuthorizationRequest): Promise<PendingProjectAuthorizationDTO> {
    const pendingProject: PendingProjectAuthorization = await this.db.pendingProjectAuthorization.create({
      data: {
        integratorId: input.integratorId,
        providerProjectId: input.projectId,
        token: encryptData(input.apiToken),
        members: {
          createMany: {
            data: input.members.map((member) => {
              return { email: member.email };
            }),
          },
        },
        organization: {
          connectOrCreate: {
            // if the org does not exist, then we create it. otherwise, we create a relation with the existing one
            where: {
              name: input.organizationName,
            },
            create: {
              name: input.organizationName,
            },
          },
        },
        issueProvider: {
          // same as above but with issue provider (linear, jira, etc.)
          connectOrCreate: {
            where: {
              name: input.issueProviderName,
            },
            create: {
              name: input.issueProviderName,
            },
          },
        },
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
