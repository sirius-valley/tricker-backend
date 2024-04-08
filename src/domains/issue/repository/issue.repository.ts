import { type IssueInput, type IssueDTO, type IssueViewDTO, type PMIssueFilterParameters, type IssueDetailsDTO, type UserProject, type IssueUpdateTrickerInput } from '@domains/issue/dto';

export interface IssueRepository {
  create: (data: IssueInput) => Promise<IssueViewDTO>;
  getByProviderId: (providerId: string) => Promise<null | IssueDTO>;
  updateById: (data: IssueUpdateTrickerInput) => Promise<IssueViewDTO>;
  getById: (id: string) => Promise<IssueDTO | null>;
  getIssueDetailsById: (id: string) => Promise<IssueDetailsDTO | null>;
  getWithFilters: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getByProjectId: (projectId: string) => Promise<IssueViewDTO[]>;
  getByProjectIdAndUserId: (input: UserProject) => Promise<IssueViewDTO[]>;
  getByProjectIdAndName: (input: { projectId: string; name: string | undefined }) => Promise<IssueDTO | null>;
}
