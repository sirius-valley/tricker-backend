import { type ProjectLabelRepository } from '@domains/projectLabel/repository/projectLabel.repository';
import { ProjectLabelDTO } from '@domains/projectLabel/dto';
import type { PrismaClient, ProjectLabel } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class ProjectLabelRepositoryImpl implements ProjectLabelRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(projectId: string, labelId: string): Promise<ProjectLabelDTO> {
    const projectLabel: ProjectLabel = await this.db.projectLabel.create({
      data: {
        projectId,
        labelId,
      },
    });

    return new ProjectLabelDTO(projectLabel);
  }
}
