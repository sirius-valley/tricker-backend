import { type ProjectStageRepository } from '@domains/projectStage/repository/projectStage.repository';
import { type ProjectStageCreationInput, ProjectStageDTO } from '@domains/projectStage/dto';
import type { PrismaClient, ProjectStage } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class ProjectStageRepositoryImpl implements ProjectStageRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(input: ProjectStageCreationInput): Promise<ProjectStageDTO> {
    const projectStage: ProjectStage = await this.db.projectStage.create({
      data: {
        projectId: input.projectId,
        stageId: input.stageId,
        type: input.type,
      },
    });

    return new ProjectStageDTO(projectStage);
  }

  /**
   * Retrieves a project stage by project ID and stage ID.
   *
   * @param {Object} input - The input object containing project ID and stage ID.
   * @param {string} input.projectId - The ID of the project.
   * @param {string} input.stageId - The ID of the stage.
   * @returns {Promise<ProjectStageDTO | null>} A promise that resolves to the project stage DTO if found, otherwise null.
   */
  async getByProjectIdAndStageId(input: { projectId: string; stageId: string }): Promise<ProjectStageDTO | null> {
    const projectStage: ProjectStage | null = await this.db.projectStage.findUnique({
      where: {
        stageId_projectId: {
          projectId: input.projectId,
          stageId: input.stageId,
        },
      },
    });

    return projectStage != null ? new ProjectStageDTO(projectStage) : null;
  }
}
