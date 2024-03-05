import { type IntegrationRepository } from '@domains/integration/repository/integration.repository';
import { type AuthorizationRequest } from '@domains/integration/dto';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import type { PrismaClient } from '@prisma/client';
import { encryptData } from '@utils';

export class IntegrationRepositoryImpl implements IntegrationRepository {
  constructor(private readonly db: PrismaClient) {}

  async createIntegrationProjectRequest(input: AuthorizationRequest): Promise<PendingProjectAuthorizationDTO> {
    const result = await this.db.$transaction(async (tx) => {
      return await tx.pendingProjectAuthorization.create({
        data: {
          integratorId: input.integratorId,
          providerProjectId: input.projectId,
          token: encryptData(input.apiToken),
          emails: {
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
    });
    return new PendingProjectAuthorizationDTO(result);
  }
}
