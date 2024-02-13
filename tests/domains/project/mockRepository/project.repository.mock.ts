import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectDTO } from '@domains/project/dto';

export class ProjectRepositoryMock implements ProjectRepository {
  async create(name: string, url: string): Promise<ProjectDTO> {
    await Promise.resolve(undefined);
  }

  async getById(projectId: string): Promise<ProjectDTO | null> {
    await Promise.resolve(undefined);
  }
}
