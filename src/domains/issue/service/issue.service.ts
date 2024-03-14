import { type TimeTrackingDTO } from '@domains/event/dto';
import { type IssueDTO, type IssueFilterParameters, type WorkedTimeDTO } from '@domains/issue/dto';

export interface IssueService {
  pauseTimer: (issueId: string) => Promise<TimeTrackingDTO>;
  getIssueWorkedSeconds: (issueId: string) => Promise<WorkedTimeDTO>;
  getIssuesFilteredAndPaginated: (filters: IssueFilterParameters) => Promise<IssueDTO[]>;
}
