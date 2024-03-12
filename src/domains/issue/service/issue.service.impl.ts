import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';
import { ConflictException, NotFoundException } from '@utils';
import { type EventRepository } from '@domains/event/repository';
import { type TimeTrackingDTO, UpdateTimeTracking } from '@domains/event/dto';

export class IssueServiceImpl implements IssueService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly eventRepository: EventRepository
  ) {}

  // todo: document
  async pauseTimer(issueId: string): Promise<TimeTrackingDTO> {
    const issue = await this.issueRepository.getById(issueId);
    if (issue == null) throw new NotFoundException('issue');

    const lastTimeTrackingEvent = await this.eventRepository.getLastTimeTrackingEvent(issueId);

    if (lastTimeTrackingEvent == null) {
      throw new ConflictException('This issue has never been played nor paused');
    }

    if (lastTimeTrackingEvent.endTime != null) {
      throw new ConflictException('This issue is already paused');
    }

    const updated = new UpdateTimeTracking({ id: lastTimeTrackingEvent.id, endTime: new Date() });
    return await this.eventRepository.updateTimeTrackingEvent(updated);
  }
}
