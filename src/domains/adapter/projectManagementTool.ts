import { type ProjectDataDTO } from '@domains/project/dto';

export interface ProjectManagementTool {
  integrateProjectData: (projectId: string, pmId: string) => Promise<ProjectDataDTO>;
}
