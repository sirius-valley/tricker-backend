import { type EventRepository } from '@domains/event/repository/event.repository';
import { type ChangeScalarEventInput, IssueChangeLogDTO, type BlockEventInput, BlockerStatusModificationDTO } from '../dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { Logger } from '@utils';

export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async createIssueChangeLog(input: ChangeScalarEventInput): Promise<IssueChangeLogDTO> {
    Logger.info(`change log creation issue id: ${input.issueId} -- ${new Date().toString()}`);
    const event = await this.db.issueChangeLog.create({
      data: {
        providerEventId: input.providerEventId,
        userEmitterId: input.userEmitterId,
        issueId: input.issueId,
        eventRegisteredAt: input.createdAt,
        field: input.field,
        from: input.from?.toString(),
        to: input.to?.toString(),
      },
    });

    return new IssueChangeLogDTO({
      ...event,
      from: event.from ?? undefined,
      to: event.to ?? undefined,
      eventRegisteredAt: event.eventRegisteredAt ?? undefined,
      providerEventId: event.providerEventId,
    });
  }

  async createIssueBlockEvent(input: BlockEventInput): Promise<BlockerStatusModificationDTO> {
    const event = await this.db.blockerStatusModification.create({
      data: {
        providerEventId: input.providerEventId,
        issueId: input.issueId,
        userEmitterId: input.userEmitterId,
        eventRegisteredAt: input.createdAt,
        status: input.type,
        reason: input.reason,
        comment: input.comment,
      },
    });

    return new BlockerStatusModificationDTO({
      ...event,
      eventRegisteredAt: event.eventRegisteredAt ?? undefined,
    });
  }
}
