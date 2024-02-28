import { type IssueProviderRepository } from '@domains/issueProvider/repository/IssueProvider.repository';
import { type IssueProviderDTO } from '@domains/issueProvider/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class IssueProviderRepositoryImpl implements IssueProviderRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async getByName(name: string): Promise<IssueProviderDTO | null> {
    /* const provider = await this.db.managementProvider.findUnique({
            data: {
                name
            }
        });


        return provider === null ? null: new ManagementProviderDTO(provider); */
    return null;
  }
}
