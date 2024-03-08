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
  readonly userEmitterId: string;
  readonly createdAt: Date;

  constructor(input: EventInput) {
    this.providerEventId = input.providerEventId;
    this.userEmitterId = input.userEmitterId;
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
  userEmitterId: string;
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
  userEmitterId: string;
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
