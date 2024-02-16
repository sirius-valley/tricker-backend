import { type ProjectDTO } from '@domains/project/dto';

export interface ProjectRepository {
  create: (name: string, providerId: string, image: string) => Promise<ProjectDTO>;
  getById: (projectId: string) => Promise<null | ProjectDTO>;
  getByProviderId: (providerId: string) => Promise<null | ProjectDTO>;
}
