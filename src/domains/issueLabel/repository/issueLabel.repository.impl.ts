import { type IssueLabelRepository } from '@domains/issueLabel/repository/issueLabel.repository';
import { IssueLabelDTO, type IssueLabelInput } from '@domains/issueLabel/dto';
import type { PrismaClient, IssueLabel } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class IssueLabelRepositoryImpl implements IssueLabelRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}
  async create(input: IssueLabelInput): Promise<IssueLabelDTO> {
    const issueLabel: IssueLabel = await this.db.issueLabel.create({
      data: {
        issueId: input.issueId,
        labelId: input.labelId,
      },
    });

    return new IssueLabelDTO(issueLabel);
  }
}
