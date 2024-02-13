import { type ProjectRepository } from '@domains/project/repository/project.repository';
import { ProjectDTO } from '@domains/project/dto';
import { type PrismaClient } from '@prisma/client';

export class ProjectRepositoryImpl implements ProjectRepository {
  constructor(private readonly db: PrismaClient) {}

  async getById(projectId: string): Promise<null | ProjectDTO> {
    const project = await this.db.project.findUnique({
      where: {
        id: projectId,
        deletedAt: null,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }

  async create(name: string, url: string): Promise<ProjectDTO> {
    const project = await this.db.project.create({
      data: {
        name,
        url,
      },
    });
    return new ProjectDTO(project);
  }
}
