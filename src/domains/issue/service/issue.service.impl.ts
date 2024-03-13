import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';
import { type EventRepository } from '@domains/event/repository';
import { type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';
import { ConflictException, NotFoundException } from '@utils';
import { type IssueDTO } from '@domains/issue/dto';
import { getTimeTrackedInSeconds } from '@utils/date-service';

export class IssueServiceImpl implements IssueService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly eventRepository: EventRepository
  ) {}

  async getIssueWorkedSeconds(issueId: string): Promise<number> {
    const issue: IssueDTO | null = await this.issueRepository.getById(issueId);
    if (issue === null) {
      throw new NotFoundException('Issue');
    }
    let workedTime: number = 0;

    const timeTrackings: TimeTrackingDTO[] = await this.eventRepository.getIssueTimeTrackingEvents(issueId);
    workedTime = timeTrackings.reduce((result: number, timeTracking: TimeTrackingDTO) => {
      return getTimeTrackedInSeconds(timeTracking.startTime, timeTracking.endTime) + result;
    }, workedTime);

    const manualTimeModifications: ManualTimeModificationDTO[] = await this.eventRepository.getIssueManualTimeModification(issueId);
    workedTime = manualTimeModifications.reduce((result: number, time: ManualTimeModificationDTO) => result + time.timeAmount, workedTime);

    if (workedTime < 0) {
      throw new ConflictException('Worked time have to be a positive value');
    }

    return workedTime;
  }
}
