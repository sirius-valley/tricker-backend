import { type IssueProviderDTO } from '@domains/issueProvider/dto';

export interface IssueProviderRepository {
  getByName: (name: string) => Promise<IssueProviderDTO | null>;
}
