import { type EventInput } from '@domains/event/dto';
import { IsDefined, IsString } from 'class-validator';

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
  readonly id!: string;
}
