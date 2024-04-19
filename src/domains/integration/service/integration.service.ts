import { type ProjectDTO } from '@domains/project/dto';
import { type AuthorizationRequestDTO, type PendingProjectInfoDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO, type ProjectsPreIntegratedInputDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface IntegrationService {
  integrateProject: (projectId: string, issueProviderName: string) => Promise<ProjectDTO>;
  getMembers: (projectId: string, apiToken: string, issueProviderName: string) => Promise<ProjectMemberDataDTO[]>;
  createPendingAuthorization: (authorizationReq: AuthorizationRequestDTO, issueProviderName: string) => Promise<{ pendingProject: PendingProjectAuthorizationDTO; pmIsAdmin: boolean }>;
  retrieveProjectsFromProvider: (input: ProjectsPreIntegratedInputDTO) => Promise<ProjectPreIntegratedDTO[]>;
  validateIntegratorIdentity: (apiKey: string, pmEmail: string | undefined, issueProviderName: string) => Promise<void>;
  declineProject: (projectId: string, issueProviderName: string) => Promise<void>;
  acceptProject: (projectId: string, issueProviderName: string) => Promise<void>;
  provideProjectInfo: (projectId: string, issueProviderName: string) => Promise<PendingProjectInfoDTO>;
}
