import { type BlockerStatusModificationDTO, type BlockEventInput, type IssueChangeLogDTO, type ChangeScalarEventInput, type TimeTrackingDTO, type UpdateTimeTracking } from '@domains/event/dto';

export interface EventRepository {
  createIssueChangeLog: (input: ChangeScalarEventInput) => Promise<IssueChangeLogDTO>;
  createIssueBlockEvent: (input: BlockEventInput) => Promise<BlockerStatusModificationDTO>;
  getLastTimeTrackingEvent: (issueId: string) => Promise<TimeTrackingDTO | null>;
  updateTimeTrackingEvent: (input: UpdateTimeTracking) => Promise<TimeTrackingDTO>;
}
