import { type IssueDataDTO } from '@domains/issue/dto';
import type { EventInput } from '@domains/event/dto';
import { type AdaptProjectDataInputDTO } from '@domains/adapter/dto';
import { type ProjectDataDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';

export interface ProjectManagementToolAdapter {
  adaptProjectData: (input: AdaptProjectDataInputDTO) => Promise<ProjectDataDTO>;
  adaptAllProjectIssuesData: (providerProjectId: string) => Promise<IssueDataDTO[]>;
  adaptIssueEventsData: (providerIssueId: string) => Promise<EventInput[]>;
  getMembersByProjectId: (providerProjectId: string, apiKey: string) => Promise<ProjectMemberDataDTO[]>;
  getAndAdaptProjects: () => Promise<ProjectPreIntegratedDTO[]>;
  getMyEmail: (apiKey: string) => Promise<string>;
}
