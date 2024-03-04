import { type ProjectDTO } from '@domains/project/dto';
import { type AuthorizationRequest, type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO, type ProjectsPreIntegratedInputDTO, type StageIntegrationInputDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface IntegrationService {
  integrateProject: (projectId: string) => Promise<ProjectDTO>;
  getMembers: (projectId: string) => Promise<ProjectMemberDataDTO[]>;
  integrateMembers: (input: MembersIntegrationInputDTO) => Promise<void>;
  integrateStages: (input: StageIntegrationInputDTO) => Promise<void>;
  integrateLabels: (input: LabelIntegrationInputDTO) => Promise<void>;
  createPendingAuthorization: (authorizationReq: AuthorizationRequest) => Promise<PendingProjectAuthorizationDTO>;
  retrieveProjectsFromProvider: (input: ProjectsPreIntegratedInputDTO) => Promise<ProjectPreIntegratedDTO[]>;
  validateIdentity: (apiKey: string, pmEmail: string | undefined) => Promise<void>;
}
