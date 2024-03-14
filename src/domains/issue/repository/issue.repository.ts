import { type IssueInput, type IssueDTO, type IssueFilterParameters, type IssueViewDTO } from '@domains/issue/dto';

export interface IssueRepository {
  create: (data: IssueInput) => Promise<IssueDTO>;
  getByProviderId: (providerId: string) => Promise<null | IssueDTO>;
  getById: (id: string) => Promise<IssueDTO | null>;
  getWithFilters: (filters: IssueFilterParameters) => Promise<IssueViewDTO[]>;
}
