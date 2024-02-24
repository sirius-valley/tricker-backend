import { type LabelRepository } from '@domains/label/repository/label.repository';
import { LabelDTO } from '@domains/label/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class LabelRepositoryImpl implements LabelRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList>) {}

  async create(name: string, providerId: string, projectId: string): Promise<LabelDTO> {
    const label = this.db.label.create({
      data: {
        name,
        providerId,
        projectId,
      },
    });

    return new LabelDTO(label as LabelDTO);
  }
}
