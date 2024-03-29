import { type IssueHistory, type IssueLabel, type User, type WorkflowState } from '@linear/sdk';

export interface AdaptProjectDataInputDTO {
  providerProjectId: string;
  pmEmail: string;
  token: string;
  memberMails: string[];
}

export interface LinearIssueData {
  stage: WorkflowState | undefined;
  labels: IssueLabel[];
  creator: User | undefined;
  assignee: User | undefined;
  priority: number;
}

export interface processIssueEventsInput {
  linearIssueId: string;
  history: IssueHistory[];
  stages: WorkflowState[];
  members: User[];
}
