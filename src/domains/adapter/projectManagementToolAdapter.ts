import { type IssueDataDTO } from '@domains/issue/dto';
import { type AdaptProjectDataInput } from '@domains/adapter/dto';
import { type ProjectDataDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type BasicProjectDataInput } from '@domains/project/dto';
import { type UserData } from '@domains/user';

export interface ProjectManagementToolAdapter {
  supports: (issueProviderName: string) => boolean;
  adaptProjectData: (input: AdaptProjectDataInput) => Promise<ProjectDataDTO>;
  adaptAllProjectIssuesData: (providerProjectId: string) => Promise<IssueDataDTO[]>;
  getMemberById: (memberId: string, apiKey: string) => Promise<UserData>;
  getProjectById: (projectId: string, apiKey: string) => Promise<BasicProjectDataInput>;
  getAndAdaptProjects: (apiKey: string) => Promise<ProjectPreIntegratedDTO[]>;
  getMembersByProjectId: (providerProjectId: string, apiKey: string) => Promise<ProjectMemberDataDTO[]>;
  getMyEmail: (apiKey: string) => Promise<string>;
}
