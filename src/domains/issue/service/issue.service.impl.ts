import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';
import { ConflictException } from '@utils';
import { type EventRepository } from '@domains/event/repository';
import { type TimeTrackingDTO, UpdateTimeTracking } from '@domains/event/dto';

export class IssueServiceImpl implements IssueService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly eventRepository: EventRepository
  ) {}

  // todo: document
  async pauseTimer(issueId: string): Promise<TimeTrackingDTO> {
    // ¿¿¿ verificar que exista el issue ??? no, porque se va a hacer con la anotacion
    // ¿¿¿ el issue esta bloqueado ??? veremos
    // encontrar el ultimo evento de time tracking asociado a ese evento
    // este ultimo evento deberia tener el endTime nulo
    // si no lo tiene nulo, devolver error de que ya esta pausado
    // setear endTime con la hora y dia del momentoany
    // guardar evento

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
