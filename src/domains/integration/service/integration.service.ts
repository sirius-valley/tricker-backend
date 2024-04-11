import { type ProjectDTO } from '@domains/project/dto';
import { type AuthorizationRequestDTO, type PendingProjectInfoDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO, type ProjectsPreIntegratedInputDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface IntegrationService {
  integrateProject: (projectId: string) => Promise<ProjectDTO>;
  getMembers: (projectId: string, apiToken: string) => Promise<ProjectMemberDataDTO[]>;
  createPendingAuthorization: (authorizationReq: AuthorizationRequestDTO) => Promise<{ pendingProject: PendingProjectAuthorizationDTO; pmIsAdmin: boolean }>;
  retrieveProjectsFromProvider: (input: ProjectsPreIntegratedInputDTO) => Promise<ProjectPreIntegratedDTO[]>;
  validateIntegratorIdentity: (apiKey: string, pmEmail: string | undefined) => Promise<void>;
  declineProject: (projectId: string) => Promise<void>;
  acceptProject: (projectId: string) => Promise<void>;
  provideProjectInfo: (projectId: string) => Promise<PendingProjectInfoDTO>;
}
