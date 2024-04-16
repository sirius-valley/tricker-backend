import type { IssueProviderDTO } from '@domains/issueProvider/dto';

export interface IssueProviderService {
  getByName: (name: string) => Promise<IssueProviderDTO>;
  getAll: () => Promise<IssueProviderDTO[]>;
}
