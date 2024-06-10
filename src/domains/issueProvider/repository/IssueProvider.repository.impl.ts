import { type IssueProviderRepository } from '@domains/issueProvider/repository/IssueProvider.repository';
import { IssueProviderDTO } from '@domains/issueProvider/dto';
import type { IssueProvider, PrismaClient } from '@prisma/client';

export class IssueProviderRepositoryImpl implements IssueProviderRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Retrieves all issue providers.
   *
   * @returns {Promise<IssueProviderDTO[]>} - A promise that resolves with an array of issue provider DTOs.
   */
  async getAll(): Promise<IssueProviderDTO[]> {
    return this.db.issueProvider.findMany();
  }

  /**
   * Retrieves an issue provider by ID.
   *
   * @param {string} id - The ID of the issue provider to retrieve.
   * @returns {Promise<IssueProviderDTO | null>} - A promise that resolves with the issue provider DTO if found, or null otherwise.
   */
  async getById(id: string): Promise<IssueProviderDTO | null> {
    const provider: IssueProvider | null = await this.db.issueProvider.findUnique({
      where: {
        id,
      },
    });

    return provider === null ? null : new IssueProviderDTO(provider);
  }

  /**
   * Retrieves an issue provider by name.
   *
   * @param {string} name - The name of the issue provider to retrieve.
   * @returns {Promise<IssueProviderDTO | null>} - A promise that resolves with the issue provider DTO if found, or null otherwise.
   */
  async getByName(name: string): Promise<IssueProviderDTO | null> {
    const provider: IssueProvider | null = await this.db.issueProvider.findUnique({
      where: {
        name,
      },
    });

    return provider === null ? null : new IssueProviderDTO(provider);
  }
}
