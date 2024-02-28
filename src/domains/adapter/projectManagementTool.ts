import { type ProjectDataDTO } from '@domains/project/dto';
import { type ProjectPreIntegratedDTO } from '@domains/integration/dto';

export interface ProjectManagementTool {
  getProjects: (key: string | undefined) => Promise<ProjectPreIntegratedDTO[]>;
  integrateProjectData: (projectId: string, pmEmail: string) => Promise<ProjectDataDTO>;
}
