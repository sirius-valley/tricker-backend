import { type IssueProviderRepository } from '@domains/issueProvider/repository/IssueProvider.repository';
import { IssueProviderDTO } from '@domains/issueProvider/dto';
import type { IssueProvider, PrismaClient } from '@prisma/client';

export class IssueProviderRepositoryImpl implements IssueProviderRepository {
  constructor(private readonly db: PrismaClient) {}

  async getById(id: string): Promise<IssueProviderDTO | null> {
    const provider: IssueProvider | null = await this.db.issueProvider.findUnique({
      where: {
        id,
      },
    });

    return provider === null ? null : new IssueProviderDTO(provider);
  }

  async getByName(name: string): Promise<IssueProviderDTO | null> {
    const provider: IssueProvider | null = await this.db.issueProvider.findUnique({
      where: {
        name,
      },
    });

    return provider === null ? null : new IssueProviderDTO(provider);
  }
}
