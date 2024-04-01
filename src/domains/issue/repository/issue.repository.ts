import { type IssueInput, type IssueDTO, type IssueViewDTO, type PMIssueFilterParameters, type IssueAndIsBlocked, type IssueDetailsDTO, type UserProject } from '@domains/issue/dto';

export interface IssueRepository {
  create: (data: IssueInput) => Promise<IssueViewDTO>;
  getByProviderId: (providerId: string) => Promise<null | IssueDTO>;
  getById: (id: string) => Promise<IssueDTO | null>;
  getIssueDetailsById: (id: string) => Promise<IssueDetailsDTO | null>;
  getWithFilters: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  updateIsBlocked: (input: IssueAndIsBlocked) => Promise<IssueDetailsDTO>;
  getByProjectId: (projectId: string) => Promise<IssueViewDTO[]>;
  getByProjectIdAndUserId: (input: UserProject) => Promise<IssueViewDTO[]>;
}
