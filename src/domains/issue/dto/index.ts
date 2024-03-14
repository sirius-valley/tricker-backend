import { type EventInput } from '@domains/event/dto';
import { IsArray, IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class IssueDTO {
  id: string;
  providerIssueId: string;
  authorId: string | null;
  assigneeId: string | null;
  projectId: string;
  stageId: string | null;
  name: string;
  title: string;
  description: string | null;
  priority: Priority;
  storyPoints: number | null;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(issue: IssueDTO) {
    this.id = issue.id;
    this.providerIssueId = issue.providerIssueId;
    this.authorId = issue.authorId;
    this.assigneeId = issue.assigneeId;
    this.projectId = issue.projectId;
    this.stageId = issue.stageId;
    this.name = issue.name;
    this.title = issue.title;
    this.description = issue.description;
    this.priority = issue.priority;
    this.storyPoints = issue.storyPoints;
    this.createdAt = issue.createdAt;
    this.deletedAt = issue.deletedAt;
  }
}

export class IssueDataDTO {
  providerIssueId: string;
  authorEmail: string | null;
  assigneeEmail: string | null;
  providerProjectId: string;
  name: string;
  title: string;
  description: string | null;
  priority: Priority;
  storyPoints: number | null;
  stage: string | null;
  labels: string[];
  events: EventInput[];

  constructor(data: IssueDataDTO) {
    this.providerIssueId = data.providerIssueId;
    this.authorEmail = data.authorEmail;
    this.assigneeEmail = data.assigneeEmail;
    this.providerProjectId = data.providerProjectId;
    this.name = data.name;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.storyPoints = data.storyPoints;
    this.stage = data.stage;
    this.labels = data.labels;
    this.events = data.events;
  }
}

export class IssueInput {
  providerIssueId: string;
  authorId: string | null;
  assigneeId: string | null;
  projectId: string;
  stageId: string | null;
  name: string;
  title: string;
  description: string | null;
  priority: Priority;
  storyPoints: number | null;

  constructor(data: IssueInput) {
    this.providerIssueId = data.providerIssueId;
    this.authorId = data.authorId;
    this.assigneeId = data.assigneeId;
    this.stageId = data.stageId;
    this.projectId = data.projectId;
    this.name = data.name;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.storyPoints = data.storyPoints;
  }
}

/**
 * Data Transfer Object (DTO) for parameters send by frontend related to worked time on an issue.
 * This class defines validation rules for issueId property.
 */
export class IssueWorkedTimeParamsDTO {
  /**
   * The ID of the issue.
   * Must be a non-empty string formatted as a UUID.
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  issueId!: string;
}

const PriorityType: {
  NO_PRIORITY: 'NO_PRIORITY';
  LOW_PRIORITY: 'LOW_PRIORITY';
  MEDIUM_PRIORITY: 'MEDIUM_PRIORITY';
  HIGH_PRIORITY: 'HIGH_PRIORITY';
  URGENT: 'URGENT';
} = {
  NO_PRIORITY: 'NO_PRIORITY',
  LOW_PRIORITY: 'LOW_PRIORITY',
  MEDIUM_PRIORITY: 'MEDIUM_PRIORITY',
  HIGH_PRIORITY: 'HIGH_PRIORITY',
  URGENT: 'URGENT',
};

export type Priority = (typeof PriorityType)[keyof typeof PriorityType];

/**
 * HTTP URL parameters for the endpoint that pauses the timer of an issue.
 */
export class IssuePauseParams {
  /**
   * The ID of the issue to pause the timer for.
   * @type {string}
   */
  @IsString()
  @IsDefined()
  readonly issueId!: string;
}

/**
 * Data Transfer Object (DTO) for representing worked time.
 * This object is send to frontend when worked time of an issue is requested.
 */
export class WorkedTimeDTO {
  workedTime: number;

  constructor(workedTime: WorkedTimeDTO) {
    this.workedTime = workedTime.workedTime;
  }
}

/**
 * Data Transfer Object (DTO) for parameters used to do the filter while retrieving issues.
 */
export class UserProjectParamsDTO {
  /**
   * The user ID associated with the issue retrieved.
   */
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  /**
   * The project ID associated with the issue retrieved.
   */
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  projectId!: string;
}

/**
 * Data Transfer Object (DTO) for optional issue filters.
 * This class defines optional filters for issues request.
 */
export class OptionalIssueFiltersDTO {
  /**
   * An optional array of stage IDs to filter issues by stage.
   */
  @IsOptional()
  @IsArray()
  stageIds?: string[];

  /**
   * An optional array of priorities to filter issues by priority level.
   */
  @IsOptional()
  @IsArray()
  priorities?: Priority[];

  /**
   * An optional array of assignee IDs to filter issues by assignee.
   */
  @IsOptional()
  @IsArray()
  assigneeIds?: string[];

  /**
   * An optional boolean which defines if issue have been defined or not.
   */
  @IsOptional()
  @IsBoolean()
  isOutOfEstimation?: boolean;
}

/**
 * Interface used by issue service to retrieve and filter issues.
 */
export interface IssueFilterParameters {
  /**
   * The user ID associated with the issue retrieved.
   */
  userId: string;

  /**
   * The project ID associated with the issue retrieved.
   */
  projectId?: string;

  /**
   * An optional array of stage IDs to filter issues by stage.
   */
  stageIds?: string[];

  /**
   * An optional array of priorities to filter issues by priority level.
   */
  priorities?: Priority[];

  /**
   * An optional array of assignee IDs to filter issues by assignee.
   */
  assigneeIds?: string[];

  /**
   * An optional boolean which defines if issue have been defined or not.
   */
  isOutOfEstimation?: boolean;
}
