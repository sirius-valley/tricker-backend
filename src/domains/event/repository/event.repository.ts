import { type BlockerStatusModificationDTO, type BlockEventInput, type IssueChangeLogDTO, type ChangeScalarEventInput, type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';

export interface EventRepository {
  createIssueChangeLog: (event: ChangeScalarEventInput) => Promise<IssueChangeLogDTO>;
  createIssueBlockEvent: (event: BlockEventInput) => Promise<BlockerStatusModificationDTO>;
  getIssueManualTimeModification: (issueId: string) => Promise<ManualTimeModificationDTO[]>;
  getIssueTimeTrackingEvents: (issueId: string) => Promise<TimeTrackingDTO[]>;
}
