import { type ProjectDTO } from '@domains/project/dto';

export interface ProjectRepository {
  create: (name: string, providerId: string, organizationId: string, image: string | null) => Promise<ProjectDTO>;
  getById: (projectId: string) => Promise<null | ProjectDTO>;
  getByProviderId: (providerId: string) => Promise<null | ProjectDTO>;
}
