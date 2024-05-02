import { type EventRepository } from '@domains/event/repository/event.repository';
import { BlockerStatusModificationDTO, type BlockEventInput, type ChangeScalarEventInput, IssueChangeLogDTO, type LogWebhookInput, LogWebhooksDTO, ManualTimeModificationDTO, TimeTrackingDTO, type UpdateLogWebhookInput, type UpdateTimeTracking } from '../dto';
import type { BlockerStatusModification, IssueChangeLog, ManualTimeModification, PrismaClient, TimeTracking } from '@prisma/client';
import { Logger } from '@utils';
import { type ManualTimeModificationEventInput } from '@domains/issue';

export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Updates a time tracking event with the provided data.
   * @param {UpdateTimeTracking} input - The data to update the time tracking event.
   * @returns {Promise<TimeTrackingDTO>} - A promise that resolves with the updated time tracking data.
   */
  async updateTimeTrackingEvent(input: UpdateTimeTracking): Promise<TimeTrackingDTO> {
    const event = await this.db.timeTracking.update({
      where: {
        id: input.id,
        deletedAt: null,
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
        deletedAt: null,
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
        issue: {
          connect: {
            id: input.issueId,
            deletedAt: null,
          },
        },
        eventRegisteredAt: input.createdAt,
        field: input.field,
        from: input.from?.toString(),
        to: input.to?.toString(),
        userEmitter:
          input.userEmitterEmail == null
            ? undefined
            : {
                connect: {
                  email: input.userEmitterEmail,
                },
              },
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
        issue: {
          connect: {
            id: input.issueId,
            deletedAt: null,
          },
        },
        eventRegisteredAt: input.createdAt,
        status: input.type,
        reason: input.reason,
        comment: input.comment,
        userEmitter:
          input.userEmitterEmail == null
            ? undefined
            : {
                connect: {
                  email: input.userEmitterEmail,
                },
              },
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
        deletedAt: null,
      },
    });

    return modifications.map((modification: ManualTimeModification) => new ManualTimeModificationDTO(modification));
  }

  async getIssueTimeTrackingEvents(issueId: string): Promise<TimeTrackingDTO[]> {
    const timeTrackingEvents: TimeTracking[] = await this.db.timeTracking.findMany({
      where: {
        issueId,
        deletedAt: null,
      },
    });

    return timeTrackingEvents.map((trackingEvent: TimeTracking) => new TimeTrackingDTO(trackingEvent));
  }

  async createTimeTrackingEvent(issueId: string): Promise<TimeTrackingDTO> {
    const event = await this.db.timeTracking.create({
      data: {
        issue: {
          connect: {
            id: issueId,
            deletedAt: null,
          },
        },
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
        deletedAt: null,
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
        deletedAt: null,
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
        issue: {
          connect: {
            id: input.issueId,
            deletedAt: null,
          },
        },
        reason: input.reason,
        timeAmount: input.timeAmount,
        modificationDate: input.date,
      },
    });

    return new ManualTimeModificationDTO({ ...event });
  }

  /**
   * Creates a new log webhook in the database.
   *
   * @param {LogWebhookInput} input - An object containing the details of the log webhook to be created.
   * @property {string} input.status - The status of the log webhook.
   * @property {object} input.payload - The payload data for the log webhook.
   * @property {string} input.providerEventId - The ID of the provider event associated with the log webhook.
   * @property {string} input.sourceId - The ID of the source that generated the log webhook.
   * @returns {Promise<LogWebhooksDTO>} A promise that resolves to a `LogWebhooksDTO` object representing the created log webhook.
   */
  async createLogWebhook(input: LogWebhookInput): Promise<LogWebhooksDTO> {
    const logWebhook = await this.db.logWebhooks.create({
      data: {
        status: input.status,
        payload: JSON.stringify(input.payload),
        providerEventId: input.providerEventId,
        sourceId: input.sourceId,
      },
    });

    return new LogWebhooksDTO({ ...logWebhook, payload: JSON.parse(JSON.stringify(input.payload)) });
  }

  /**
   * Updates an existing log webhook in the database.
   *
   * @param {UpdateLogWebhookInput} input - An object containing the details of the log webhook to be updated.
   * @property {string} input.id - The ID of the log webhook to be updated.
   * @property {string} input.status - The new status for the log webhook.
   * @returns {Promise<LogWebhooksDTO>} A promise that resolves to a `LogWebhooksDTO` object representing the updated log webhook.
   */
  async updateLogWebhook(input: UpdateLogWebhookInput): Promise<LogWebhooksDTO> {
    const logWebhook = await this.db.logWebhooks.update({
      where: {
        id: input.id,
      },
      data: {
        status: input.status,
      },
    });

    return new LogWebhooksDTO({ ...logWebhook, payload: JSON.parse(JSON.stringify(logWebhook.payload)) });
  }
}
