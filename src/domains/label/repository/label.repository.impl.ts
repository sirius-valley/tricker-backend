import { type LabelRepository } from '@domains/label/repository/label.repository';
import { LabelDTO } from '@domains/label/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class LabelRepositoryImpl implements LabelRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList>) {}

  async create(name: string): Promise<LabelDTO> {
    const label = this.db.label.create({
      data: {
        name,
      },
    });

    return new LabelDTO(label as LabelDTO);
  }

  async getByName(name: string): Promise<LabelDTO | null> {
    const label = this.db.label.findFirst({
      where: {
        name,
      },
    });

    return label === null ? null : new LabelDTO(label as LabelDTO);
  }
}
