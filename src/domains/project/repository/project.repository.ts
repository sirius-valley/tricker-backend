import { type ProjectBasicDTO, type ProjectDetailsDTO, type ProjectDTO, type ProjectsFilterInput } from '@domains/project/dto';

export interface ProjectRepository {
  getById: (projectId: string) => Promise<null | ProjectDTO>;
  getByProviderId: (providerId: string) => Promise<null | ProjectDTO>;
  getProjectDetails: (input: { userId: string; projectId: string }) => Promise<ProjectDetailsDTO | null>;
  delete: (projectId: string) => Promise<string>;
  getProjectsByUserId: (input: ProjectsFilterInput) => Promise<ProjectBasicDTO[]>;
}
