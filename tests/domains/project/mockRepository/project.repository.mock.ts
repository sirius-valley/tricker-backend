import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectDTO } from '@domains/project/dto';

export class ProjectRepositoryMock implements ProjectRepository {
  async create(name: string, url: string): Promise<ProjectDTO> {
    return {
      id: 'idP',
      name: 'Tricker',
      url: 'url',
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
    };
  }

  async getById(projectId: string): Promise<ProjectDTO | null> {
    return null;
  }
}
