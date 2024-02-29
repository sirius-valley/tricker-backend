import { type AuthorizationRequest, type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectMemberDataDTO, type StageIntegrationInputDTO } from '@domains/integration/dto';
import { type ProjectDTO } from '@domains/project/dto';
import type { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface IntegrationService {
  getMembers: (projectId: string) => Promise<ProjectMemberDataDTO[]>;
  integrateProject: (projectId: string, userId: string) => Promise<ProjectDTO>;
  integrateMembers: (input: MembersIntegrationInputDTO) => Promise<void>;
  integrateStages: (input: StageIntegrationInputDTO) => Promise<void>;
  integrateLabels: (input: LabelIntegrationInputDTO) => Promise<void>;
  createPendingAuthorization: (authorizationReq: AuthorizationRequest) => Promise<PendingProjectAuthorizationDTO>;
}
