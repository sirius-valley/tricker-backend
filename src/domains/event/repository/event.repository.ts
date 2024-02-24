import { type BlockerStatusModificationDTO, type BlockEventInput, type IssueChangeLogDTO, type ChangeScalarEventInput } from '@domains/event/dto';

export interface EventRepository {
  createIssueChangeLog: (event: ChangeScalarEventInput) => Promise<IssueChangeLogDTO>;
  createIssueBlockEvent: (event: BlockEventInput) => Promise<BlockerStatusModificationDTO>;
}
