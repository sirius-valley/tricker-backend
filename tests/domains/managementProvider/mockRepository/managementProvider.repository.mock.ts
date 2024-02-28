import { type IssueProviderRepository } from 'domains/issueProvider/repository';
import { type IssueProviderDTO } from 'domains/issueProvider/dto';

export class ManagementProviderRepositoryMock implements IssueProviderRepository {
  async getByName(name: string): Promise<IssueProviderDTO | null> {
    return null;
  }
}
