import { type ProjectDataDTO, type ProjectPreIntegratedDTO } from '@domains/project/dto';

export interface ProjectManagementTool {
  getProjects: (key: string | undefined) => Promise<ProjectPreIntegratedDTO[]>;
  integrateProjectData: (projectId: string, pmEmail: string) => Promise<ProjectDataDTO>;
  validateSecret: (secret: string | undefined) => void;
}
