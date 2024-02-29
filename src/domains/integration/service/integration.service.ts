import type { ProjectDTO } from '@domains/project/dto';
import { type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectPreIntegratedDTO, type ProjectsPreIntegratedInputDTO, type StageIntegrationInputDTO } from '@domains/integration/dto';

export interface IntegrationService {
  integrateProject: (projectId: string) => Promise<ProjectDTO>;
  integrateMembers: (input: MembersIntegrationInputDTO) => Promise<void>;
  integrateStages: (input: StageIntegrationInputDTO) => Promise<void>;
  integrateLabels: (input: LabelIntegrationInputDTO) => Promise<void>;
  retrieveProjectsFromProvider: (input: ProjectsPreIntegratedInputDTO) => Promise<ProjectPreIntegratedDTO[]>;
  validateIdentity: (apiKey: string, pmEmail: string | undefined) => Promise<void>;
}
