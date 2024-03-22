import { type IssueInput, type IssueDTO, type IssueViewDTO, type PMIssueFilterParameters, type IssueAndIsBlocked, type IssueDetailsDTO } from '@domains/issue/dto';

export interface IssueRepository {
  create: (data: IssueInput) => Promise<IssueDTO>;
  getByProviderId: (providerId: string) => Promise<null | IssueDTO>;
  getById: (id: string) => Promise<IssueDTO | null>;
  getWithFilters: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  updateIsBlocked: (input: IssueAndIsBlocked) => Promise<IssueDetailsDTO>;
}
