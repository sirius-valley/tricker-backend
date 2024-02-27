import { type ProjectDataDTO } from '@domains/project/dto';
import { type IssueDataDTO } from '@domains/issue/dto';
import type { EventInput } from '@domains/event/dto';

export interface ProjectManagementTool {
  integrateProjectData: (providerProjectId: string, pmId: string) => Promise<ProjectDataDTO>;
  integrateAllProjectIssuesData: (providerProjectId: string) => Promise<IssueDataDTO[]>;
  integrateIssueEvents: (providerIssueId: string) => Promise<EventInput[]>;
}
