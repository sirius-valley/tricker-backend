import { type ProjectRepository } from '@domains/project/repository/project.repository';
import { ProjectDTO } from '@domains/project/dto';
import { type PrismaClient, type Project } from '@prisma/client';

export class ProjectRepositoryImpl implements ProjectRepository {
  constructor(private readonly db: PrismaClient) {}

  async getById(projectId: string): Promise<null | ProjectDTO> {
    const project: Project | null = await this.db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }

  // TO DO: after fixing prisma schema image prop will be optional
  async create(name: string, providerId: string, image: string | null): Promise<ProjectDTO> {
    const project: Project = await this.db.project.create({
      data: {
        name,
        image,
        providerId,
      },
    });
    return new ProjectDTO(project);
  }

  async getByProviderId(providerId: string): Promise<ProjectDTO | null> {
    const project: Project | null = await this.db.project.findFirst({
      where: {
        providerId,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }
}
