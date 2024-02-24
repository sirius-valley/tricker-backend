import { type ProjectStageRepository } from '@domains/projectStage/repository/projectStage.repository';
import { ProjectStageDTO } from '@domains/projectStage/dto';
import type { PrismaClient, ProjectStage } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class ProjectStageRepositoryImpl implements ProjectStageRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(projectId: string, stageId: string): Promise<ProjectStageDTO> {
    const projectStage: ProjectStage = await this.db.projectStage.create({
      data: {
        projectId,
        stageId,
      },
    });
    return new ProjectStageDTO(projectStage);
  }
}
