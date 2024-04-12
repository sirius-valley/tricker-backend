import { type ProjectRepository } from '@domains/project/repository/project.repository';
import { ProjectBasicDTO, ProjectDTO, type ProjectsFilterInput } from '@domains/project/dto';
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

  async getByProviderId(providerId: string): Promise<ProjectDTO | null> {
    const project: Project | null = await this.db.project.findFirst({
      where: {
        providerId,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }

  /**
   * Retrieves projects based on the provided filter input.
   * @param input - The input object containing the filter criteria.
   * @returns An array of ProjectBasicDTO objects representing the retrieved projects.
   */
  async getProjectsByUserId(input: ProjectsFilterInput): Promise<ProjectBasicDTO[]> {
    const projects = await this.db.project.findMany({
      where: {
        usersRoles: {
          some: {
            userId: input.userId,
          },
        },
        name: {
          contains: input.projectName ?? '',
          mode: 'insensitive',
        },
      },
    });

    return projects.map((project) => new ProjectBasicDTO(project));
  }
}
