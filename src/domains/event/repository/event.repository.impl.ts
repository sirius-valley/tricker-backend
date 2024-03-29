import { type EventRepository } from '@domains/event/repository/event.repository';
import { type ChangeScalarEventInput, IssueChangeLogDTO, type BlockEventInput, BlockerStatusModificationDTO, ManualTimeModificationDTO, TimeTrackingDTO, type UpdateTimeTracking } from '../dto';
import type { BlockerStatusModification, IssueChangeLog, ManualTimeModification, PrismaClient, TimeTracking } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { Logger } from '@utils';
import { type ManualTimeModificationEventInput } from '@domains/issue';

export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  /**
   * Updates a time tracking event with the provided data.
   * @param {UpdateTimeTracking} input - The data to update the time tracking event.
   * @returns {Promise<TimeTrackingDTO>} - A promise that resolves with the updated time tracking data.
   */
  async updateTimeTrackingEvent(input: UpdateTimeTracking): Promise<TimeTrackingDTO> {
    const event = await this.db.timeTracking.update({
      where: {
        id: input.id,
      },
      data: {
        endTime: input.endTime,
      },
    });

    return new TimeTrackingDTO(event);
  }

  /**
   * Retrieves the last time tracking event for the specified issue.
   * @param {string} issueId - The ID of the issue to retrieve the last time tracking event for.
   * @returns {Promise<TimeTrackingDTO | null>} - A promise that resolves with the last time tracking event if found, or null otherwise.
   */
  async getLastTimeTrackingEvent(issueId: string): Promise<TimeTrackingDTO | null> {
    const event = await this.db.timeTracking.findFirst({
      take: 1,
      where: {
        issueId,
      },
      orderBy: [{ startTime: 'desc' }],
    });

    return event != null ? new TimeTrackingDTO(event) : null;
  }

  async createIssueChangeLog(input: ChangeScalarEventInput): Promise<IssueChangeLogDTO> {
    Logger.info(`change log creation issue id: ${input.issueId} -- ${new Date().toString()}`);
    const event = await this.db.issueChangeLog.create({
      data: {
        providerEventId: input.providerEventId!,
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

  async getIssueManualTimeModification(issueId: string): Promise<ManualTimeModificationDTO[]> {
    const modifications: ManualTimeModification[] = await this.db.manualTimeModification.findMany({
      where: {
        issueId,
      },
    });

    return modifications.map((modification: ManualTimeModification) => new ManualTimeModificationDTO(modification));
  }

  async getIssueTimeTrackingEvents(issueId: string): Promise<TimeTrackingDTO[]> {
    const timeTrackingEvents: TimeTracking[] = await this.db.timeTracking.findMany({
      where: {
        issueId,
      },
    });

    return timeTrackingEvents.map((trackingEvent: TimeTracking) => new TimeTrackingDTO(trackingEvent));
  }

  async createTimeTrackingEvent(issueId: string): Promise<TimeTrackingDTO> {
    const event = await this.db.timeTracking.create({
      data: {
        issueId,
        startTime: new Date(),
      },
    });

    return new TimeTrackingDTO(event);
  }

  /**
   * Retrieves blocker events related to a specific issue.
   * @param issueId The unique identifier of the issue.
   * @returns An array of blocker status modification DTOs.
   */
  async getIssueBlockEvents(issueId: string): Promise<BlockerStatusModificationDTO[]> {
    const blockerEvents: BlockerStatusModification[] = await this.db.blockerStatusModification.findMany({
      where: {
        issueId,
      },
    });

    return blockerEvents.map((event) => new BlockerStatusModificationDTO({ ...event, eventRegisteredAt: event.eventRegisteredAt ?? undefined }));
  }

  /**
   * Retrieves change logs related to a specific issue.
   * @param issueId The unique identifier of the issue.
   * @returns An array of issue change log DTOs.
   */
  async getIssueChangeLogs(issueId: string): Promise<IssueChangeLogDTO[]> {
    const changeLogs: IssueChangeLog[] = await this.db.issueChangeLog.findMany({
      where: {
        issueId,
      },
    });

    return changeLogs.map(
      (event) =>
        new IssueChangeLogDTO({
          ...event,
          from: event.from ?? undefined,
          to: event.to ?? undefined,
          eventRegisteredAt: event.eventRegisteredAt ?? undefined,
        })
    );
  }

  /**
   * Creates a manual time modification event.
   * @async
   * @param {ManualTimeModificationEventInput} input - The input data for the manual time modification event.
   * @returns {Promise<ManualTimeModificationDTO>} A promise that resolves to the created manual time modification DTO.
   */
  async createManualTimeModification(input: ManualTimeModificationEventInput): Promise<ManualTimeModificationDTO> {
    const event = await this.db.manualTimeModification.create({
      data: {
        issueId: input.issueId,
        reason: input.reason,
        timeAmount: input.timeAmount,
        modificationDate: input.date,
      },
    });

    return new ManualTimeModificationDTO({ ...event });
  }
}
