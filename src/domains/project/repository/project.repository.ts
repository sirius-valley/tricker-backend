import { type ProjectBasicDTO, type ProjectDTO, type ProjectsFilterInput } from '@domains/project/dto';

export interface ProjectRepository {
  getById: (projectId: string) => Promise<null | ProjectDTO>;
  getByProviderId: (providerId: string) => Promise<null | ProjectDTO>;
  getProjectsByUserId: (input: ProjectsFilterInput) => Promise<ProjectBasicDTO[]>;
}
