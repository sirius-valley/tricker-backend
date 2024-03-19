export type BlockEventType = 'NO_STATUS' | 'BLOCKED_BY' | 'BLOCKING_TO';
export type EventInputArray<T extends EventInput> = T[];

export enum TrickerBlockEventType {
  NO_STATUS = 'NO_STATUS',
  BLOCKED_BY = 'BLOCKED_BY',
  BLOCKING_TO = 'BLOCKING_TO',
}

export enum LinearBlockTypeConvention {
  BLOCKING_TO = 'x',
  BLOCKED_BY = 'b',
}

export enum LinearActionTypeConvention {
  ADD = 'a',
  REMOVE = 'r',
}

export class EventInput {
  readonly providerEventId: string;
  issueId: string;
  readonly userEmitterEmail?: string;
  readonly createdAt: Date;
  userEmitterId?: string | null;

  constructor(input: EventInput) {
    this.providerEventId = input.providerEventId;
    this.userEmitterEmail = input.userEmitterEmail;
    this.issueId = input.issueId;
    this.createdAt = input.createdAt;
  }
}

export class ChangeScalarEventInput extends EventInput {
  readonly field: string;
  readonly from?: number | string;
  readonly to?: number | string;

  constructor(input: ChangeScalarEventInput) {
    super(input);
    this.field = input.field;
    this.from = input.from;
    this.to = input.to;
  }
}

export class BlockEventInput extends EventInput {
  readonly type: BlockEventType;
  readonly reason: string;
  readonly comment: string;

  constructor(input: BlockEventInput) {
    super(input);
    this.type = input.type;
    this.reason = input.reason;
    this.comment = input.comment;
  }
}

export class IssueChangeLogDTO {
  id: string;
  providerEventId: string;
  userEmitterId: string | null;
  issueId: string;
  field: string;
  from?: string;
  to?: string;
  eventRegisteredAt?: Date;
  createdAt: Date;

  constructor(input: IssueChangeLogDTO) {
    this.id = input.id;
    this.providerEventId = input.providerEventId;
    this.userEmitterId = input.userEmitterId;
    this.issueId = input.issueId;
    this.field = input.field;
    this.from = input.from;
    this.to = input.to;
    this.eventRegisteredAt = input.eventRegisteredAt;
    this.createdAt = input.createdAt;
  }
}

export class BlockerStatusModificationDTO {
  id: string;
  providerEventId: string;
  userEmitterId: string | null;
  issueId: string;
  status: string;
  eventRegisteredAt?: Date;
  createdAt: Date;
  reason: string;
  comment: string;

  constructor(input: BlockerStatusModificationDTO) {
    this.id = input.id;
    this.providerEventId = input.providerEventId;
    this.userEmitterId = input.userEmitterId;
    this.issueId = input.issueId;
    this.status = input.status;
    this.eventRegisteredAt = input.eventRegisteredAt;
    this.createdAt = input.createdAt;
    this.reason = input.reason;
    this.comment = input.comment;
  }
}

/**
 * Data transfer object representing a time tracking event.
 * This one is used when the user plays or pauses the timer.
 */
export class TimeTrackingDTO {
  /**
   * The ID of the time tracking event.
   * @type {string}
   */
  id: string;

  /**
   * The ID of the issue associated with the event.
   * @type {string}
   */
  issueId: string;

  /**
   * The start time of the event.
   * @type {Date}
   */
  startTime: Date;

  /**
   * The end time of the event, or null if not ended yet.
   * @type {Date | null}
   */
  endTime: Date | null;

  /**
   * Creates an instance of TimeTrackingDTO.
   * @param {Object} input - The data to initialize the TimeTrackingDTO instance.
   * @param {string} input.id - The ID of the time tracking event.
   * @param {string} input.issueId - The ID of the issue associated with the event.
   * @param {Date} input.startTime - The start time of the event.
   * @param {Date | null} input.endTime - The end time of the event, or null if not ended yet.
   */
  constructor(input: TimeTrackingDTO) {
    this.id = input.id;
    this.issueId = input.issueId;
    this.startTime = input.startTime;
    this.endTime = input.endTime;
  }
}

/**
 * Data transfer object representing an update to a time tracking event.
 */
export class UpdateTimeTracking {
  /**
   * The ID of the time tracking event to be updated.
   * @type {string}
   */
  id: string;

  /**
   * The updated start time of the event, if provided.
   * @type {Date | undefined}
   */
  startTime?: Date;

  /**
   * The updated end time of the event, if provided.
   * @type {Date | undefined}
   */
  endTime?: Date;

  /**
   * Creates an instance of UpdateTimeTracking.
   * @param {Object} input - The data to initialize the UpdateTimeTracking instance.
   * @param {string} input.id - The ID of the time tracking event to be updated.
   * @param {Date} [input.startTime] - The updated start time of the event, if provided.
   * @param {Date} [input.endTime] - The updated end time of the event, if provided.
   */
  constructor(input: UpdateTimeTracking) {
    this.id = input.id;
    this.startTime = input.startTime;
    this.endTime = input.endTime;
  }
}

/**
 * Data Transfer Object (DTO) for representing manual time modifications.
 */
export class ManualTimeModificationDTO {
  /**
   * The unique identifier for the manual time modification.
   */
  id: string;
  /**
   * The ID of the issue associated with the time modification.
   */
  issueId: string;
  /**
   * The amount of time modified, represented in seconds.
   */
  timeAmount: number;
  /**
   * The date and time when the modification was made.
   */
  modificationDate: Date;
  /**
   * The reason provided for the manual time modification.
   */
  reason: string;

  /**
   * Constructs a new instance of ManualTimeModificationDTO.
   * @param {ManualTimeModificationDTO} timeModification The data transfer object containing manual time modification information.
   */
  constructor(timeModification: ManualTimeModificationDTO) {
    this.id = timeModification.id;
    this.issueId = timeModification.issueId;
    this.timeAmount = timeModification.timeAmount;
    this.modificationDate = timeModification.modificationDate;
    this.reason = timeModification.reason;
  }
}

/**
 * Interface representing time tracking dates.
 * This interface defines start and end dates for time tracking.
 */
export interface TimeTrackingDates {
  /**
   * The start date for time tracking.
   */
  startDate: Date;
  /**
   * The end date for time tracking, can be null if tracking is ongoing.
   */
  endDate: Date | null;
}
