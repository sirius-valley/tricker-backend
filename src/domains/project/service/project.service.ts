import { type ProjectDTO } from '@domains/project/dto';

export interface ProjectService {
  integrateProject: (projectId: string, userId: string) => Promise<ProjectDTO>;
}
