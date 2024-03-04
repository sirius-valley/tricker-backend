import type { IssueProviderDTO } from '@domains/issueProvider/dto';

export interface ManagementProviderService {
  getByName: (name: string) => Promise<IssueProviderDTO>;
}
