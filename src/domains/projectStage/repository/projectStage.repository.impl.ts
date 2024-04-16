import { type ProjectStageRepository } from '@domains/projectStage/repository/projectStage.repository';
import { type ProjectStageCreationInput, ProjectStageDTO } from '@domains/projectStage/dto';
import type { PrismaClient, ProjectStage } from '@prisma/client';

export class ProjectStageRepositoryImpl implements ProjectStageRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Creates a new project stage asynchronously.
   * @param input The input data for creating the project stage.
   * @returns A promise resolving to a ProjectStageDTO representing the created project stage.
   */
  async create(input: ProjectStageCreationInput): Promise<ProjectStageDTO> {
    const projectStage: ProjectStage = await this.db.projectStage.create({
      data: {
        projectId: input.projectId,
        type: input.type,
        name: input.name,
        position: input.position,
        color: input.color,
      },
    });

    return new ProjectStageDTO(projectStage);
  }

  /**
   * Retrieves a project stage by project ID and name.
   *
   * @param {Object} input - The input object containing project ID and stage ID.
   * @param {string} input.projectId - The ID of the project.
   * @param {string} input.name - The name of the stage.
   * @returns {Promise<ProjectStageDTO | null>} A promise that resolves to the project stage DTO if found, otherwise null.
   */
  async getByProjectIdAndName(input: { projectId: string; name: string }): Promise<ProjectStageDTO | null> {
    const projectStage: ProjectStage | null = await this.db.projectStage.findUnique({
      where: {
        projectId_name: {
          projectId: input.projectId,
          name: input.name,
        },
        deletedAt: null,
      },
    });

    return projectStage != null ? new ProjectStageDTO(projectStage) : null;
  }

  async getById(id: string): Promise<ProjectStageDTO | null> {
    const projectStage = await this.db.projectStage.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    return projectStage === null ? null : new ProjectStageDTO(projectStage);
  }
}
