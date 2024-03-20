import { type TimeTrackingDTO } from '@domains/event/dto';
import { type DevIssueFilterParameters, type IssueViewDTO, type PMIssueFilterParameters, type WorkedTimeDTO } from '@domains/issue/dto';

export interface IssueService {
  pauseTimer: (issueId: string) => Promise<TimeTrackingDTO>;
  resumeTimer: (issueId: string) => Promise<TimeTrackingDTO>;
  getIssueWorkedSeconds: (issueId: string) => Promise<WorkedTimeDTO>;
  getDevIssuesFilteredAndPaginated: (filters: DevIssueFilterParameters) => Promise<IssueViewDTO[]>;
  getIssuesFilteredAndPaginated: (filters: PMIssueFilterParameters) => Promise<IssueViewDTO[]>;
}
