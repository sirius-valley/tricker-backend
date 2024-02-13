import { type ProjectDTO } from '@domains/project/dto';

export interface ProjectRepository {
  create: (name: string, url: string) => Promise<ProjectDTO>;
  getById: (projectId: string) => Promise<null | ProjectDTO>;
}
