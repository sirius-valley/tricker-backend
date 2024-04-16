import { type IssueProviderDTO } from '@domains/issueProvider/dto';

export interface IssueProviderRepository {
  getByName: (name: string) => Promise<IssueProviderDTO | null>;
  getById: (id: string) => Promise<IssueProviderDTO | null>;
  getAll: () => Promise<IssueProviderDTO[]>;
}
