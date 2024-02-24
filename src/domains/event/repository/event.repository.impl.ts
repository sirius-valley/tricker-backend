import { type EventRepository } from '@domains/event/repository/event.repository';
import { type ChangeScalarEventInput, type IssueChangeLogDTO, type BlockEventInput, type BlockerStatusModificationDTO } from '../dto';
import type { PrismaClient } from '@prisma/client';

export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly db: PrismaClient) {}

  async createIssueChangeLog(event: ChangeScalarEventInput): Promise<IssueChangeLogDTO> {
    return await this.db.issueChangeLog.create({
      data: {
        providerEventId: event.providerEventId,
        userEmitterId: event.userEmitterId,
        issueId: event.issueId,
        eventRegisteredAt: event.createdAt,
        field: event.field,
        from: event.from?.toString(),
        to: event.to?.toString(),
      },
    });
  }

  async createIssueBlockEvent(event: BlockEventInput): Promise<BlockerStatusModificationDTO> {
    return await this.db.blockerStatusModification.create({
      data: {
        providerEventId: event.providerEventId,
        issueId: event.issueId,
        userEmitterId: event.userEmitterId,
        eventRegisteredAt: event.createdAt,
        status: event.type,
        reason: event.reason,
        comment: event.comment,
      },
    });
  }
}
