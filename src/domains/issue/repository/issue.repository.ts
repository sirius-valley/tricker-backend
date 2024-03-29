import { type IssueInput, type IssueDTO, type IssueViewDTO, type PMIssueFilterParameters, type IssueDetailsDTO, type UserProject, type IssueUpdateInput } from '@domains/issue/dto';

export interface IssueRepository {
  create: (data: IssueInput) => Promise<IssueDTO>;
  getByProviderId: (providerId: string) => Promise<null | IssueDTO>;
  updateById: (data: IssueUpdateInput) => Promise<IssueViewDTO>;
  getById: (id: string) => Promise<IssueDTO | null>;
  getIssueDetailsById: (id: string) => Promise<IssueDetailsDTO | null>;
  getWithFilters: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getByProjectId: (projectId: string) => Promise<IssueViewDTO[]>;
  getByProjectIdAndUserId: (input: UserProject) => Promise<IssueViewDTO[]>;
}
