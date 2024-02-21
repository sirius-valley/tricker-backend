import { type ProjectRepository } from '@domains/project/repository/project.repository';
import { ProjectDTO } from '@domains/project/dto';
import { type PrismaClient, type Project } from '@prisma/client';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';

export class ProjectRepositoryImpl implements ProjectRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async getById(projectId: string): Promise<null | ProjectDTO> {
    const project: Project | null = await this.db.project.findUnique({
      where: {
        id: projectId,
        deletedAt: null,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }

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
        deletedAt: null,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }
}
