import { type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';
import { type ManualTimeModificationEventInput, type WorkedTimeDTO } from '@domains/issue/dto';

export interface IssueService {
  pauseTimer: (issueId: string) => Promise<TimeTrackingDTO>;
  getIssueWorkedSeconds: (issueId: string) => Promise<WorkedTimeDTO>;
  createManualTimeTracking: (input: ManualTimeModificationEventInput) => Promise<ManualTimeModificationDTO>;
}
