import { type BlockerStatusModificationDTO, type EventHistoryLogDTO, type IssueAddBlockerInput, type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';
import { type DevIssueFilterParameters, type IssueAndAssignee, type IssueExtendedDTO, type IssueViewDTO, type ManualTimeModificationEventInput, type PMIssueFilterParameters, type WorkedTimeDTO } from '@domains/issue/dto';

export interface IssueService {
  pauseTimer: (issueId: string) => Promise<TimeTrackingDTO>;
  resumeTimer: (issueId: string) => Promise<TimeTrackingDTO>;
  getIssueWorkedSeconds: (issueId: string) => Promise<WorkedTimeDTO>;
  createManualTimeTracking: (input: ManualTimeModificationEventInput) => Promise<ManualTimeModificationDTO>;
  getDevIssuesFilteredAndPaginated: (filters: DevIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getPMIssuesFilteredAndPaginated: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getIssuesFilteredAndPaginated: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
  blockIssueWithTrickerUI: (input: IssueAddBlockerInput) => Promise<BlockerStatusModificationDTO>;
  unblockIssueWithTrickerUI: (input: IssueAndAssignee) => Promise<BlockerStatusModificationDTO>;
  getIssueWithChronology: (issueId: string) => Promise<IssueExtendedDTO>;
  getIssueChronology: (issueId: string) => Promise<EventHistoryLogDTO[]>;
}
