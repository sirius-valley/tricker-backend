import { type ProjectDTO } from '@domains/project/dto';
import { type AuthorizationRequestDTO, type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO, type ProjectsPreIntegratedInputDTO, type StageIntegrationInput } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface IntegrationService {
  integrateProject: (projectId: string, mailToken: string) => Promise<ProjectDTO>;
  getMembers: (projectId: string, apiToken: string) => Promise<ProjectMemberDataDTO[]>;
  integrateMembers: (input: MembersIntegrationInputDTO) => Promise<void>;
  integrateStages: (input: StageIntegrationInput) => Promise<void>;
  integrateLabels: (input: LabelIntegrationInputDTO) => Promise<void>;
  createPendingAuthorization: (authorizationReq: AuthorizationRequestDTO) => Promise<PendingProjectAuthorizationDTO>;
  retrieveProjectsFromProvider: (input: ProjectsPreIntegratedInputDTO) => Promise<ProjectPreIntegratedDTO[]>;
  validateIntegratorIdentity: (apiKey: string, pmEmail: string | undefined) => Promise<void>;
  declineProject: (projectId: string, mailToken: string) => Promise<void>;
  acceptProject: (projectId: string, mailToken: string) => Promise<void>;
  verifyAdminIdentity: (providerProjectId: string, mailToken: string) => Promise<PendingProjectAuthorizationDTO>;
}
