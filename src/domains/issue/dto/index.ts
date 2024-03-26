import { type EventHistoryLogDTO, type EventInput } from '@domains/event/dto';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { type LabelDTO } from '@domains/label/dto';
import { type UserIssueDTO } from '@domains/user';
import { IsTodayOrAfterToday } from '@utils';
import { type StageExtendedDTO } from '@domains/projectStage/dto';

export class IssueDTO {
  id: string;
  providerIssueId: string;
  authorId: string | null;
  assigneeId: string | null;
  projectId: string;
  projectStageId: string | null;
  name: string;
  title: string;
  description: string | null;
  priority: Priority;
  storyPoints: number | null;
  isBlocked: boolean;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(issue: IssueDTO) {
    this.id = issue.id;
    this.providerIssueId = issue.providerIssueId;
    this.authorId = issue.authorId;
    this.assigneeId = issue.assigneeId;
    this.projectId = issue.projectId;
    this.projectStageId = issue.projectStageId;
    this.name = issue.name;
    this.title = issue.title;
    this.description = issue.description;
    this.priority = issue.priority;
    this.storyPoints = issue.storyPoints;
    this.isBlocked = issue.isBlocked;
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
  projectStageId: string | null;
  name: string;
  title: string;
  description: string | null;
  priority: Priority;
  storyPoints: number | null;

  constructor(data: IssueInput) {
    this.providerIssueId = data.providerIssueId;
    this.authorId = data.authorId;
    this.assigneeId = data.assigneeId;
    this.projectStageId = data.projectStageId;
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
export class IssueIdParamDTO {
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
  description: string | null;
  priority: Priority;
  storyPoints: number | null;
  isBlocked: boolean;
  labels: LabelDTO[];
  isTracking: boolean;

  constructor(issueView: IssueViewDTO) {
    this.id = issueView.id;
    this.assignee = issueView.assignee;
    this.stage = issueView.stage;
    this.name = issueView.name;
    this.title = issueView.title;
    this.description = issueView.description;
    this.priority = issueView.priority;
    this.storyPoints = issueView.storyPoints;
    this.isBlocked = issueView.isBlocked;
    this.labels = issueView.labels;
    this.isTracking = issueView.isTracking;
  }
}

/**
 * Represents detailed information about an issue.
 */
export class IssueDetailsDTO {
  /** The ID of the issue. */
  id: string;

  /** Information about the assignee of the issue. */
  assignee: UserIssueDTO | null;

  /** The name of the issue. */
  name: string;

  /** The title of the issue. */
  title: string;

  /** The description of the issue. */
  description: string | null;

  /** The priority of the issue. */
  priority: Priority;

  /** The story points associated with the issue. */
  storyPoints: number | null;

  /** A boolean flag indicating whether the issue is blocked. */
  isBlocked: boolean;

  /** The labels associated with the issue. */
  labels: LabelDTO[];

  /**
   * Constructs a new instance of the IssueDetailsDTO class.
   * @param issue - The issue object used to initialize the instance.
   */
  constructor(issue: IssueDetailsDTO) {
    this.id = issue.id;
    this.assignee = issue.assignee;
    this.name = issue.name;
    this.title = issue.title;
    this.description = issue.description;
    this.priority = issue.priority;
    this.storyPoints = issue.storyPoints;
    this.isBlocked = issue.isBlocked;
    this.labels = issue.labels;
  }
}

/**
 * Represents extended information about an issue, including its chronology.
 */
export class IssueExtendedDTO extends IssueDetailsDTO {
  /** The chronological history log of events associated with the issue. */
  chronology: EventHistoryLogDTO[];

  /**
   * Constructs a new instance of the IssueExtendedDTO class.
   * @param issue - The issue object used to initialize the instance.
   */
  constructor(issue: IssueExtendedDTO) {
    super(issue);
    this.chronology = issue.chronology;
  }
}

/**
 * Interface representing a user-project relationship.
 */
export interface UserProject {
  /** Identifier of the user. */
  userId: string;
  /** Identifier of the project. */
  projectId: string;
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
  @IsTodayOrAfterToday()
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

/**
 * Represents an association between a user and an issue.
 */
export interface IssueAndAssignee {
  /**
   * The Cognito ID of the user associated with the issue.
   */
  userCognitoId: string;

  /**
   * The ID of the issue.
   */
  issueId: string;
}

/**
 * Represents the status of an issue, indicating whether it's blocked or not.
 */
export interface IssueAndIsBlocked {
  /**
   * The ID of the issue.
   */
  issueId: string;

  /**
   * A boolean flag indicating whether the issue is blocked or not.
   */
  isBlocked: boolean;
}
