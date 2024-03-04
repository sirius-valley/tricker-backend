import { type IssueDataDTO } from '@domains/issue/dto';
import type { EventInput } from '@domains/event/dto';
import { type AdaptProjectDataInputDTO } from '@domains/adapter/dto';
import { type ProjectDataDTO, type ProjectMemberDataDTO } from '@domains/integration/dto';
import { type BasicProjectDataDTO } from '@domains/project/dto';
import { type UserDataDTO } from '@domains/user';

export interface ProjectManagementToolAdapter {
  adaptProjectData: (input: AdaptProjectDataInputDTO) => Promise<ProjectDataDTO>;
  adaptAllProjectIssuesData: (providerProjectId: string) => Promise<IssueDataDTO[]>;
  adaptIssueEventsData: (providerIssueId: string) => Promise<EventInput[]>;
  getMembersByProjectId: (providerProjectId: string) => Promise<ProjectMemberDataDTO[]>;
  getMemberById: (memberId: string) => Promise<UserDataDTO>;
  getProjectById: (projectId: string) => Promise<BasicProjectDataDTO>;
  setKey: (apiKey: string) => void;
}
