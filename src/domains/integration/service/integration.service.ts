import { type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectMemberDataDTO, type StageIntegrationInputDTO } from '@domains/integration/dto';
import { type ProjectDTO } from '@domains/project/dto';

export interface IntegrationService {
  getMembers: (projectId: string) => Promise<ProjectMemberDataDTO[]>;
  integrateProject: (projectId: string, userId: string) => Promise<ProjectDTO>;
  integrateMembers: (input: MembersIntegrationInputDTO) => Promise<void>;
  integrateStages: (input: StageIntegrationInputDTO) => Promise<void>;
  integrateLabels: (input: LabelIntegrationInputDTO) => Promise<void>;
}
