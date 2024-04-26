import { IsNotEmpty, IsString } from 'class-validator';
import { type WebhookStatus } from '@domains/webhook/dto';

export type BlockEventType = 'NO_STATUS' | 'BLOCKED_BY' | 'BLOCKING_TO';
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
  ADD_EXPLICIT = 'a',
  ADD_IMPLICIT = 'o',
  REMOVE = 'r',
}

/**
 * Represents common data shared across different event types during provider event adaptation.
 */
export class EventData {
  /**
   * Unique identifier of the event in the provider system, if any.
   */
  providerEventId: string | null;

  /**
   * Email of the user who triggered the event, if any.
   */
  userEmitterEmail: string | null;

  /**
   * Date object specifying when the event occurred.
   */
  createdAt: Date;

  /**
   * Constructor to initialize properties from the input object.
   * @param {EventData} input - Object containing event data.
   */
  constructor(input: EventData) {
    this.providerEventId = input.providerEventId;
    this.userEmitterEmail = input.userEmitterEmail;
    this.createdAt = input.createdAt;
  }
}

/**
 * Represents an event related to changing a scalar value.
 * Extends the base EventData class.
 */
export class ChangeScalarEventData extends EventData {
  /**
   * Name of the field that was changed.
   */
  field: string;

  /**
   * Optional. Previous value of the field.
   */
  from?: string;

  /**
   * Optional. New value of the field.
   */
  to?: string;

  /**
   * Constructor to initialize properties from the input object.
   * @param {ChangeScalarEventData} input - Object containing change scalar event data.
   */
  constructor(input: ChangeScalarEventData) {
    super(input);
    this.field = input.field;
    this.from = input.from;
    this.to = input.to;
  }
}

/**
 * Represents an event related to blocking an issue or being blocked by an issue.
 * Extends the base EventData class.
 */
export class BlockEventData extends EventData {
  /**
   * Type of block.
   */
  type: BlockEventType;

  /**
   * Reason for the block.
   */
  reason: string;

  /**
   * Additional context about the block.
   */
  comment: string;

  /**
   * Constructor to initialize properties from the input object.
   * @param {BlockEventData} input - Object containing block event data.
   */
  constructor(input: BlockEventData) {
    super(input);
    this.type = input.type;
    this.reason = input.reason;
    this.comment = input.comment;
  }
}

/**
 * Used for representing input data for blocking events, when persisting event in database.
 * Extends the BlockEventData class.
 */
export class BlockEventInput extends BlockEventData {
  /**
   * Issue identifier associated with the block event.
   */
  issueId: string;

  /**
   * Constructor to initialize properties from the input object.
   * @param {BlockEventInput} input - Object containing block event input data.
   */
  constructor(input: BlockEventInput) {
    super(input);
    this.issueId = input.issueId;
  }
}

/**
 * Used for representing input data for change scalar events, when persisting event in database.
 * Extends the ChangeScalarEventData class.
 */
export class ChangeScalarEventInput extends ChangeScalarEventData {
  /**
   * Issue identifier associated with the block event.
   */
  issueId: string;

  /**
   * Constructor to initialize properties from the input object.
   * @param {ChangeScalarEventInput} input - Object containing change scalar event input data.
   */
  constructor(input: ChangeScalarEventInput) {
    super(input);
    this.issueId = input.issueId;
  }
}

/**
 * Used for representing input data for change scalar events, when persisting event in database.
 * Extends the ChangeScalarEventInput class.
 */
export class ChangeScalarEventInputExtended extends ChangeScalarEventInput {
  /** Project ID */
  projectId: string;

  /**
   * Constructor to initialize properties from the input object.
   * @param {ChangeScalarEventInputExtended} input - Object containing change scalar event input data.
   */
  constructor(input: ChangeScalarEventInputExtended) {
    super(input);
    this.projectId = input.projectId;
  }
}

export class IssueChangeLogDTO {
  id: string;
  providerEventId: string | null;
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

/**
 * Data transfer object for modifying blocker status.
 */
export class BlockerStatusModificationDTO {
  /** Unique identifier of the modification. */
  id: string;
  /** Identifier of the provider event associated with the modification. */
  providerEventId: string | null;
  /** Identifier of the user who emitted the modification. */
  userEmitterId: string | null;
  /** Identifier of the issue that is being modified. */
  issueId: string;
  /** New status of the blocker. */
  status: string;
  /** Date and time when the event was registered. */
  eventRegisteredAt?: Date;
  /** Date and time when the modification was created. */
  createdAt: Date;
  /** Reason for the modification. */
  reason: string;
  /** Additional comment related to the modification. */
  comment: string;

  /**
   * Constructs a new instance of BlockerStatusModificationDTO.
   * @param input An object containing properties to initialize the DTO.
   */
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
   * The creation date of the time modification register.
   */
  createdAt: Date;

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
    this.createdAt = timeModification.createdAt;
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

/**
 * Data Transfer Object (DTO) for adding a blocker to an issue.
 */
export class IssueAddBlockerParamsDTO {
  /**
   * The reason for adding the blocker.
   */
  @IsString()
  @IsNotEmpty()
  reason!: string;

  /**
   * Additional comments about the blocker.
   */
  @IsString()
  @IsNotEmpty()
  comment!: string;
}

/**
 * Input interface for adding a blocker to an issue.
 */
export interface IssueAddBlockerInput {
  /**
   * The ID of the issue to which the blocker is being added.
   */
  issueId: string;

  /**
   * The Cognito ID of the user adding the blocker.
   */
  userCognitoId: string;

  /**
   * The ID of the event from the provider, if available.
   */
  providerEventId: string | null;

  /**
   * The reason for adding the blocker.
   */
  reason: string;

  /**
   * Additional comments about the blocker.
   */
  comment: string;
}

/**
 * Data Transfer Object (DTO) for representing event history logs.
 */
export class EventHistoryLogDTO {
  /**
   * The ID of the event.
   */
  eventId: string;

  /**
   * The message associated with the event.
   */
  message?: string;

  /**
   * Additional comments about the event.
   */
  comment?: string;

  /**
   * Indicates whether the event is a blocker.
   */
  isBlocker: boolean;

  /**
   * The date of the event.
   */
  date: Date;

  /**
   * The date of the event.
   */
  modificationTimeAmount?: number;

  /**
   * The date of the event.
   */
  modificationDate?: Date;

  /**
   * The date of the event.
   */
  modificationReason?: string;

  /**
   * Constructs an event history log object.
   */
  constructor(history: EventHistoryLogDTO) {
    this.eventId = history.eventId;
    this.message = history.message;
    this.comment = history.comment;
    this.isBlocker = history.isBlocker;
    this.date = history.date;
    this.modificationReason = history.modificationReason;
    this.modificationTimeAmount = history.modificationTimeAmount;
    this.modificationDate = history.modificationDate;
  }
}

/**
 * Data transfer object for LogWebhooks.
 */
export class LogWebhooksDTO {
  /** The unique identifier of the log webhook. */
  id: string;

  /** The status of the webhook. */
  status: WebhookStatus;

  /** The identifier of the source associated with the webhook. */
  sourceId: string;

  /** The provider event identifier associated with the webhook. */
  providerEventId: string;

  /** The payload data associated with the webhook, represented as a JSON object. */
  payload: Record<string, unknown> | null;

  /** The date and time when the webhook was created. */
  createdAt: Date;

  /**
   * Constructs a new LogWebhooksDTO object.
   * @param log The log object to initialize the DTO.
   */
  constructor(log: LogWebhooksDTO) {
    this.id = log.id;
    this.status = log.status;
    this.sourceId = log.sourceId;
    this.providerEventId = log.providerEventId;
    this.payload = log.payload;
    this.createdAt = log.createdAt;
  }
}

/**
 * Input interface for creating log webhooks.
 */
export interface LogWebhookInput {
  /** The status of the webhook. */
  status: WebhookStatus;

  /** The identifier of the source associated with the webhook. */
  sourceId: string;

  /** The provider event identifier associated with the webhook. */
  providerEventId: string;

  /** The payload data associated with the webhook, represented as a JSON object. */
  payload: Record<string, unknown> | null;
}
