import { type ProjectDetailsDTO, type ProjectDTO } from '@domains/project/dto';

export interface ProjectRepository {
  getById: (projectId: string) => Promise<null | ProjectDTO>;
  getByProviderId: (providerId: string) => Promise<null | ProjectDTO>;
  getProjectDetails: (userId: string, projectId: string) => Promise<ProjectDetailsDTO | null>;
}
