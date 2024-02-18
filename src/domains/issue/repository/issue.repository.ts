import { type CreateIssueDTO, type IssueDTO } from '@domains/issue/dto';

export interface IssueRepository {
  create: (data: CreateIssueDTO) => Promise<IssueDTO>;
  getByProviderId: (providerId: string) => Promise<null | IssueDTO>;
}
