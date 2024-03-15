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
}
