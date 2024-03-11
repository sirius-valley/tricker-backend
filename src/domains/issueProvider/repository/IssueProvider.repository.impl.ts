import { type IssueProviderRepository } from '@domains/issueProvider/repository/IssueProvider.repository';
import { IssueProviderDTO } from '@domains/issueProvider/dto';
import type { IssueProvider, PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class IssueProviderRepositoryImpl implements IssueProviderRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async getByName(name: string): Promise<IssueProviderDTO | null> {
    const provider: IssueProvider | null = await this.db.issueProvider.findUnique({
      where: {
        name,
      },
    });

    return provider === null ? null : new IssueProviderDTO(provider);
  }
}
