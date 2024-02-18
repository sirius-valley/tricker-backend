import { type ProjectDataDTO } from '@domains/project/dto';
import { type IssueDataDTO } from '@domains/issue/dto';

export interface ProjectManagementTool {
  integrateProjectData: (providerProjectId: string, pmId: string) => Promise<ProjectDataDTO>;
  integrateAllProjectIssuesData: (providerProjectId: string) => Promise<IssueDataDTO[]>;
}
