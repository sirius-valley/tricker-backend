import { type EventInput } from '@domains/event/dto';
import { IsArray, IsBoolean, IsDateString, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { IsAfterOrEqualDate } from '@utils';
import { type LabelDTO } from '@domains/label/dto';
import { type StageExtendedDTO } from '@domains/stage/dto';
import { type UserIssueDTO } from '@domains/user';

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
 * Data Transfer Object (DTO) for optional issue filters retrieved for a Project Manager.
 * This class defines optional filters for issues request.
 */
export class PMOptionalIssueFiltersDTO {
  /**
   * An optional array of stage IDs to filter issues by stage.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  @IsString({ each: true })
  assigneeIds?: string[];

  /**
   * An optional boolean which defines if issue have been defined or not.
   */
  @IsOptional()
  @IsBoolean()
  isOutOfEstimation?: boolean;

  /**
   * An optional issue id which defines the cursor in the pagination.
   */
  @IsOptional()
  @IsUUID()
  cursor?: string;
}

/**
 * Interface used by issue service to retrieve and filter issues.
 */
export interface PMIssueFilterParameters {
  /**
   * The user ID associated with the issue retrieved.
   */
  userId: string;

  /**
   * The project ID associated with the issue retrieved.
   */
  projectId: string;

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

  /**
   * An optional array of label IDs to filter issues by labels.
   */
  labelIds?: string[];

  /**
   * An optional issue id which defines the cursor in the pagination.
   */
  cursor?: string;
}

export class DevOptionalIssueFiltersDTO {
  /**
   * An optional array of stage IDs to filter issues by stage.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stageIds?: string[];

  /**
   * An optional array of priorities to filter issues by priority level.
   */
  @IsOptional()
  @IsArray()
  priorities?: Priority[];

  /**
   * An optional boolean which defines if issue have been defined or not.
   */
  @IsOptional()
  @IsBoolean()
  isOutOfEstimation?: boolean;

  /**
   * An optional issue id which defines the cursor in the pagination.
   */
  @IsOptional()
  @IsUUID()
  cursor?: string;
}

export interface DevIssueFilterParameters {
  /**
   * The user ID associated with the issue retrieved.
   */
  userId: string;

  /**
   * The project ID associated with the issue retrieved.
   */
  projectId: string;

  /**
   * An optional array of stage IDs to filter issues by stage.
   */
  stageIds?: string[];

  /**
   * An optional array of priorities to filter issues by priority level.
   */
  priorities?: Priority[];

  /**
   * An optional boolean which defines if issue have been defined or not.
   */
  isOutOfEstimation?: boolean;

  /**
   * An optional array of label IDs to filter issues by labels.
   */
  labelIds?: string[];

  /**
   * An optional issue id which defines the cursor in the pagination.
   */
  cursor?: string;
}

/**
 * Represents a data transfer object (DTO) for an issue view.
 * This DTO contains information about an issue, including its ID, assignee, stage, name, title, priority, story points, and labels.
 * This is sent to the developer or the Project Manager to have a general view of all issues.
 */
export class IssueViewDTO {
  id: string;
  assignee: UserIssueDTO | null;
  stage: StageExtendedDTO | null;
  name: string;
  title: string;
  priority: Priority;
  storyPoints: number | null;
  labels: LabelDTO[];

  constructor(issueView: IssueViewDTO) {
    this.id = issueView.id;
    this.assignee = issueView.assignee;
    this.stage = issueView.stage;
    this.name = issueView.name;
    this.title = issueView.title;
    this.priority = issueView.priority;
    this.storyPoints = issueView.storyPoints;
    this.labels = issueView.labels;
  }
}

/**
 * Data transfer object (DTO) representing a manual time modification request.
 * This DTO is used to validate and structure the input data for creating manual time modifications.
 */
export class ManualTimeModificationRequestDTO {
  /**
   * The amount of time to be added or subtracted. Must be a positive number.
   */
  @IsPositive()
  @IsNumber()
  timeAmount!: number;

  // to transform manually into date in service
  /**
   * The date of the manual time modification. Must be a date string after or equal to today.
   */
  @IsAfterOrEqualDate(new Date(), { message: 'Date is not today or after today' })
  @IsDateString()
  readonly date!: string;

  /**
   * The reason for the manual time modification. Must not be empty.
   */
  @IsNotEmpty()
  readonly reason!: string;
}

/**
 * Interface representing input data for a manual time modification event.
 *
 * This interface defines the structure of the data required to create a manual time modification event.
 */
export interface ManualTimeModificationEventInput {
  /**
   * The ID of the issue for which the time modification is being made.
   */
  readonly issueId: string;

  /**
   * The amount of time to be added or subtracted. Positive if adding, negative if subtracting
   */
  readonly timeAmount: number;

  /**
   * The reason for the manual time modification.
   */
  readonly reason: string;

  /**
   * The date of the manual time modification.
   */
  readonly date: Date;
}
