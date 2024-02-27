import { type IssueDTO } from '@domains/issue/dto';

export interface IssueService {
  integrateProjectIssues: (projectId: string) => Promise<IssueDTO[]>;
}
