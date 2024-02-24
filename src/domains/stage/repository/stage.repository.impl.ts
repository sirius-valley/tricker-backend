import { type StageRepository } from '@domains/stage/repository/stage.repository';
import { StageDTO } from '@domains/stage/dto';
import type { PrismaClient, Stage } from '@prisma/client';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';

export class StageRepositoryImpl implements StageRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(name: string): Promise<StageDTO> {
    const stage: Stage = await this.db.stage.create({
      data: {
        name,
      },
    });

    return new StageDTO(stage);
  }

  async getByName(name: string): Promise<StageDTO | null> {
    const stage = await this.db.stage.findFirst({
      where: {
        name,
      },
    });

    return stage == null ? null : new StageDTO(stage);
  }
}
