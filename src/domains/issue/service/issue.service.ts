import { type TimeTrackingDTO } from '@domains/event/dto';

export interface IssueService {
  pauseTimer: (issueId: string) => Promise<TimeTrackingDTO>;
}
