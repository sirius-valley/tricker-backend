import { type ProjectDataDTO } from '@domains/project/dto';

export interface ProjectManagementTool {
  integrateProjectData: (projectId: string, pmEmail: string) => Promise<ProjectDataDTO>;
}
