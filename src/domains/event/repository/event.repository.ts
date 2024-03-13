import { type BlockerStatusModificationDTO, type BlockEventInput, type IssueChangeLogDTO, type ChangeScalarEventInput, type TimeTrackingDTO, type UpdateTimeTracking, type ManualTimeModificationDTO } from '@domains/event/dto';

export interface EventRepository {
  createIssueChangeLog: (input: ChangeScalarEventInput) => Promise<IssueChangeLogDTO>;
  createIssueBlockEvent: (input: BlockEventInput) => Promise<BlockerStatusModificationDTO>;
  getLastTimeTrackingEvent: (issueId: string) => Promise<TimeTrackingDTO | null>;
  updateTimeTrackingEvent: (input: UpdateTimeTracking) => Promise<TimeTrackingDTO>;
  getIssueManualTimeModification: (issueId: string) => Promise<ManualTimeModificationDTO[]>;
  getIssueTimeTrackingEvents: (issueId: string) => Promise<TimeTrackingDTO[]>;
}
