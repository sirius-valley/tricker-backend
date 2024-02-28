import type { ProjectDTO } from '@domains/project/dto';
import { type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectPreIntegratedDTO, type StageIntegrationInputDTO } from '@domains/integration/dto';

export interface IntegrationService {
  integrateProject: (projectId: string, userId: string) => Promise<ProjectDTO>;
  integrateMembers: (input: MembersIntegrationInputDTO) => Promise<void>;
  integrateStages: (input: StageIntegrationInputDTO) => Promise<void>;
  integrateLabels: (input: LabelIntegrationInputDTO) => Promise<void>;
  retrieveProjectsFromProvider: (providerName: string, secret: string | undefined) => Promise<ProjectPreIntegratedDTO[]>;
}
