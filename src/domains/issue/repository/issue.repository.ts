import { type IssueInput, type IssueDTO } from '@domains/issue/dto';

export interface IssueRepository {
  create: (data: IssueInput) => Promise<IssueDTO>;
  getByProviderId: (providerId: string) => Promise<null | IssueDTO>;
  getById: (id: string) => Promise<IssueDTO | null>;
}
