import { type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';
import { type DevIssueFilterParameters, type IssueViewDTO, type ManualTimeModificationEventInput, type PMIssueFilterParameters, type WorkedTimeDTO } from '@domains/issue/dto';

export interface IssueService {
  pauseTimer: (issueId: string) => Promise<TimeTrackingDTO>;
  getIssueWorkedSeconds: (issueId: string) => Promise<WorkedTimeDTO>;
  createManualTimeTracking: (input: ManualTimeModificationEventInput) => Promise<ManualTimeModificationDTO>;
  getDevIssuesFilteredAndPaginated: (filters: DevIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getIssuesFilteredAndPaginated: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
}
