import { type BlockerStatusModificationDTO, type ChangeScalarEventInputExtended, type EventHistoryLogDTO, type IssueAddBlockerInput, type IssueChangeLogDTO, type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';
import { type DevIssueFilterParameters, type IssueAndAssignee, type IssueExtendedDTO, type IssueInput, type IssueViewDTO, type ManualTimeModificationEventInput, type PMIssueFilterParameters, type WorkedTimeDTO, type IssueUpdateWebhookInput, type IssueUpdateTrickerInput } from '@domains/issue/dto';

export interface IssueService {
  pauseTimer: (input: IssueAndAssignee) => Promise<TimeTrackingDTO>;
  resumeTimer: (input: IssueAndAssignee) => Promise<TimeTrackingDTO>;
  getIssueWorkedSeconds: (issueId: string) => Promise<WorkedTimeDTO>;
  createManualTimeTracking: (input: ManualTimeModificationEventInput) => Promise<ManualTimeModificationDTO>;
  getDevIssuesFilteredAndPaginated: (filters: DevIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getPMIssuesFilteredAndPaginated: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getIssuesFilteredAndPaginated: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  blockIssueWithTrickerUI: (input: IssueAddBlockerInput) => Promise<BlockerStatusModificationDTO>;
  unblockIssueWithTrickerUI: (input: IssueAndAssignee) => Promise<BlockerStatusModificationDTO>;
  createIssueChangeLog: (input: ChangeScalarEventInputExtended) => Promise<IssueChangeLogDTO>;
  getIssueWithChronology: (issueId: string) => Promise<IssueExtendedDTO>;
  getIssueChronology: (issueId: string) => Promise<EventHistoryLogDTO[]>;
  createIssue: (input: IssueInput) => Promise<IssueViewDTO>;
  updateIssueById: (data: IssueUpdateTrickerInput) => Promise<IssueViewDTO>;
  updateIssueByProviderId: (data: IssueUpdateWebhookInput) => Promise<IssueViewDTO>;
}
