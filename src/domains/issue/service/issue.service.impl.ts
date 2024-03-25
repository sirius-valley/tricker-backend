import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';
import { type EventRepository } from '@domains/event/repository';
import { type BlockerStatusModificationDTO, EventHistoryLogDTO, type IssueAddBlockerInput, type IssueChangeLogDTO, type ManualTimeModificationDTO, type TimeTrackingDTO, TrickerBlockEventType, UpdateTimeTracking } from '@domains/event/dto';
import { ConflictException, ForbiddenException, NotFoundException } from '@utils';
import { type DevIssueFilterParameters, type IssueAndAssignee, type IssueDetailsDTO, type IssueDTO, type ManualTimeModificationEventInput, type IssueExtendedDTO, type IssueViewDTO, type PMIssueFilterParameters, type WorkedTimeDTO } from '@domains/issue/dto';
import { getTimeTrackedInSeconds } from '@utils/date-service';
import { type UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectDTO } from '@domains/project/dto';
import { type ProjectStageRepository } from '@domains/projectStage/repository';
import { type ProjectStageDTO } from '@domains/projectStage/dto';

export class IssueServiceImpl implements IssueService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly projectStageRepository: ProjectStageRepository
  ) {}

  /**
   * Resumes the timer for tracking time on an issue.
   *
   * This function resumes the timer for tracking time on the specified issue.
   * It ensures that the issue exists and is in a state where time tracking can be resumed.
   * If the issue is already tracking time, a ConflictException is thrown.
   *
   * @param {string} issueId - The ID of the issue to resume time tracking for.
   * @returns {Promise<TimeTrackingDTO>} A promise that resolves to the time tracking DTO for the resumed timer.
   * @throws {NotFoundException} If the specified issue does not exist.
   * @throws {ConflictException} If the issue is not in a state where time tracking can be resumed, or if the issue is already tracking time.
   */
  async resumeTimer(issueId: string): Promise<TimeTrackingDTO> {
    const issue = await this.issueRepository.getById(issueId);
    if (issue == null) throw new NotFoundException('issue');

    // this is kinda odd because you first have to check if your stageId is not null instead of just look for the project stage (look to do)
    // if (issue.stageId == null && !(await this.isIssueInStartedStage(issue))) throw new ConflictException('This issue needs to be started in order to be able to track time.')

    const isIssueInStartedStage: boolean = await this.isIssueInStartedStage(issue.projectStageId);
    if (!isIssueInStartedStage) throw new ConflictException('This issue needs to be started in order to be able to track time');

    const lastTimeTrackingEvent = await this.eventRepository.getLastTimeTrackingEvent(issueId);

    if (lastTimeTrackingEvent != null && lastTimeTrackingEvent.endTime == null) {
      throw new ConflictException('This issue is already tracking time');
    }

    return await this.eventRepository.createTimeTrackingEvent(issueId);
  }

  /**
   * Checks if the issue has a stage assigned and that it is in started stage.
   *
   * @param projectStageId The ID pf the projectStage
   * @returns {Promise<boolean>} A promise that resolves to true if the issue is in a started stage, otherwise false.
   */
  private async isIssueInStartedStage(projectStageId: string | null): Promise<boolean> {
    if (projectStageId == null) return false;
    const projectStage: ProjectStageDTO | null = await this.projectStageRepository.getById(projectStageId);

    return projectStage != null && projectStage.type === 'STARTED';
  }

  /**
   * Creates a manual tracking time event for adding or subtracting worked time from an issue.
   * @param {ManualTimeModificationEventInput} input - Input data for the manual time tracking event.
   * @returns {Promise<ManualTimeModificationDTO>} A promise resolving to the created manual time modification DTO.
   * @throws {NotFoundException} If the specified issue doesn't exist.
   * @throws {ConflictException} If subtracting time exceeds the total worked time of the issue.
   */
  async createManualTimeTracking(input: ManualTimeModificationEventInput): Promise<ManualTimeModificationDTO> {
    const issue = await this.issueRepository.getById(input.issueId);
    if (issue == null) throw new NotFoundException('issue');

    const { workedTime } = await this.getIssueWorkedSeconds(input.issueId);
    if (input.timeAmount < 0 && workedTime < -input.timeAmount) {
      throw new ConflictException('The time amount you are trying to substract exceeds the total worked time of the issue');
    }

    return await this.eventRepository.createManualTimeModification(input);
  }

  /**
   * Pauses the timer for a specific issue.
   * @param {string} issueId - The ID of the issue to pause the timer for.
   * @returns {Promise<TimeTrackingDTO>} - A promise that resolves with the updated time tracking data.
   * @throws {NotFoundException} - If the issue with the given ID is not found.
   * @throws {ConflictException} - If the issue has never been played nor paused, or if the issue is already paused.
   */
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

  /**
   * Retrieves the total worked time in seconds for a given issue.
   * This method calculates the total time tracked automatically and manually
   * for the specified issue.
   *
   * @param {string} issueId - The ID of the issue to retrieve worked time for.
   * @returns {Promise<number>} A promise that resolves to the total worked time in seconds.
   * @throws {NotFoundException} If the specified issue cannot be found.
   * @throws {ConflictException} If the calculated worked time is negative.
   */
  async getIssueWorkedSeconds(issueId: string): Promise<WorkedTimeDTO> {
    const issue: IssueDTO | null = await this.issueRepository.getById(issueId);
    if (issue === null) {
      throw new NotFoundException('Issue');
    }
    let workedTime = 0;

    const timeTrackings: TimeTrackingDTO[] = await this.eventRepository.getIssueTimeTrackingEvents(issueId);
    workedTime = timeTrackings.reduce((result: number, timeTracking: TimeTrackingDTO) => {
      return getTimeTrackedInSeconds({ startDate: timeTracking.startTime, endDate: timeTracking.endTime }) + result;
    }, workedTime);

    const manualTimeModifications: ManualTimeModificationDTO[] = await this.eventRepository.getIssueManualTimeModification(issueId);
    workedTime = manualTimeModifications.reduce((result: number, time: ManualTimeModificationDTO) => result + time.timeAmount, workedTime);

    return { workedTime };
  }

  /**
   * Retrieves a list of filtered and paginated issues based on the provided filters.
   * @param filters - Parameters used for filtering issues.
   * @returns An array of IssueViewDTO objects representing the filtered and paginated issues.
   * @throws {NotFoundException} If the user or project is not found.
   */
  async getDevIssuesFilteredAndPaginated(filters: DevIssueFilterParameters): Promise<IssueViewDTO[]> {
    await this.validateUserExistence(filters.userId);
    await this.validateProjectExistence(filters.projectId);

    return this.getIssuesFilteredAndPaginated({ ...filters, assigneeIds: [filters.userId] });
  }

  /**
   * Retrieves a list of filtered and paginated issues based on the provided filters.
   * @param filters - Parameters used for filtering issues.
   * @returns An array of IssueViewDTO objects representing the filtered and paginated issues.
   * @throws {NotFoundException} If the user or project is not found.
   */
  async getPMIssuesFilteredAndPaginated(filters: PMIssueFilterParameters): Promise<IssueViewDTO[]> {
    await this.validateProjectExistence(filters.projectId); // user already validated in middleware

    return this.getIssuesFilteredAndPaginated(filters);
  }

  /**
   * Retrieves a list of filtered and paginated issues based on the provided filters.
   * It can be used by Developers or Project Managers due to its flexibility
   * @param filters - Parameters used for filtering issues.
   * @returns An array of IssueViewDTO objects representing the filtered and paginated issues.
   */
  async getIssuesFilteredAndPaginated(filters: PMIssueFilterParameters): Promise<IssueViewDTO[]> {
    return this.issueRepository.getWithFilters(filters);
  }

  /**
   * Blocks an issue using a Tricker UI.
   * @param input - An object containing the issue ID, user ID, reason, and comment for blocking the issue.
   * @returns A Promise that resolves to an BlockerStatusModificationDTO object representing the updated issue details.
   * @throws {ConflictException} If the issue is already blocked.
   */
  async blockIssueWithTrickerUI(input: IssueAddBlockerInput): Promise<BlockerStatusModificationDTO> {
    const { user, issue } = await this.validateIssueAndAssignee({ issueId: input.issueId, userCognitoId: input.userCognitoId });
    if (issue.isBlocked) {
      throw new ConflictException('Issue already blocked');
    }

    const blockEvent: BlockerStatusModificationDTO = await this.eventRepository.createIssueBlockEvent({
      issueId: input.issueId,
      userEmitterId: user.id,
      reason: input.reason,
      comment: input.comment,
      createdAt: new Date(),
      providerEventId: null,
      type: TrickerBlockEventType.BLOCKED_BY,
    });

    await this.issueRepository.updateIsBlocked({ issueId: input.issueId, isBlocked: true });

    return blockEvent;
  }

  /**
   * Unblocks the issue using the Tricker UI.
   * @param input - An object containing the user Cognito ID and issue ID.
   * @returns A Promise that resolves to an BlockerStatusModificationDTO representing the updated issue.
   * @throws NotFoundException if the user or issue is not found.
   * @throws ForbiddenException if the user is not the assignee of the issue.
   */
  async unblockIssueWithTrickerUI(input: IssueAndAssignee): Promise<BlockerStatusModificationDTO> {
    const { user, issue } = await this.validateIssueAndAssignee({ issueId: input.issueId, userCognitoId: input.userCognitoId });
    if (!issue.isBlocked) {
      throw new ConflictException('Issue already unblocked');
    }
    const unblockEvent: BlockerStatusModificationDTO = await this.eventRepository.createIssueBlockEvent({
      issueId: input.issueId,
      userEmitterId: user.id,
      reason: `Unblocked by user ${user.name}.`,
      comment: `Issue ${issue.name} unblocked.`,
      createdAt: new Date(),
      providerEventId: null,
      type: TrickerBlockEventType.BLOCKED_BY,
    });

    await this.issueRepository.updateIsBlocked({ issueId: input.issueId, isBlocked: false });

    return unblockEvent;
  }

  /**
   * Retrieves detailed information about a specific issue including its chronological events.
   * @param issueId The unique identifier of the issue.
   * @returns A promise that resolves to an IssueExtendedDTO object containing issue details and its chronological events.
   * @throws NotFoundException if the specified issue is not found.
   */
  async getIssueWithChronology(issueId: string): Promise<IssueExtendedDTO> {
    const issue: IssueDetailsDTO | null = await this.issueRepository.getIssueDetailsById(issueId);
    if (issue === null) {
      throw new NotFoundException('Issue');
    }
    const orderedEvents: EventHistoryLogDTO[] = await this.getIssueChronology(issueId);

    return { ...issue, chronology: orderedEvents };
  }

  /**
   * Retrieves the chronology of events for a specific issue.
   *
   * @param issueId The ID of the issue to retrieve the chronology for.
   * @returns A Promise that resolves to an array of EventHistoryLogDTO objects representing the chronology of events.
   * @throws NotFoundException if the issue with the given ID is not found.
   */
  async getIssueChronology(issueId: string): Promise<EventHistoryLogDTO[]> {
    const issue: IssueDetailsDTO | null = await this.issueRepository.getIssueDetailsById(issueId);
    if (issue === null) {
      throw new NotFoundException('Issue');
    }
    const blockEvents: BlockerStatusModificationDTO[] = await this.eventRepository.getIssueBlockEvents(issueId);
    const changeLogEvents: IssueChangeLogDTO[] = await this.eventRepository.getIssueChangeLogs(issueId);
    const manualModifications: ManualTimeModificationDTO[] = await this.eventRepository.getIssueManualTimeModification(issueId);
    const timeTrackingEvents: TimeTrackingDTO[] = await this.eventRepository.getIssueTimeTrackingEvents(issueId);

    const parsedEvents: EventHistoryLogDTO[] = [];

    this.parseBlockEvents(blockEvents, parsedEvents);
    this.parseChangeLogEvents(changeLogEvents, parsedEvents);
    this.parseManualTimeModifications(manualModifications, parsedEvents);
    this.parseTimeTrackingEvents(timeTrackingEvents, parsedEvents);

    return parsedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Validates the existence of a user.
   * Throws a NotFoundException if the user does not exist or is inactive.
   * @param userId - The ID of the user to validate.
   * @returns A Promise resolving to a UserDTO object representing the validated user.
   * @throws NotFoundException if the user does not exist or is inactive.
   */
  private async validateUserExistence(userId: string): Promise<UserDTO> {
    const user: UserDTO | null = await this.userRepository.getById(userId);
    if (user === null) {
      throw new NotFoundException('User');
    }
    if (user.cognitoId === null || user.deletedAt !== null) {
      throw new NotFoundException('User');
    }

    return user;
  }

  /**
   * Validates the existence of a project.
   * Throws a NotFoundException if the project does not exist.
   * @param projectId - The ID of the project to validate.
   * @returns A Promise resolving to a ProjectDTO object representing the validated project.
   * @throws NotFoundException if the project does not exist.
   */
  private async validateProjectExistence(projectId: string): Promise<ProjectDTO> {
    const project: ProjectDTO | null = await this.projectRepository.getById(projectId);
    if (project === null) {
      throw new NotFoundException('Project');
    }

    return project;
  }

  /**
   * Validates the issue and assignee.
   * @param input - An object containing the user Cognito ID and issue ID.
   * @returns A Promise that resolves to a UserDTO representing the validated user.
   * @throws NotFoundException if the user or issue is not found.
   * @throws ForbiddenException if the user is not the assignee of the issue.
   */
  private async validateIssueAndAssignee(input: IssueAndAssignee): Promise<{ user: UserDTO; issue: IssueDTO }> {
    const user: UserDTO | null = await this.userRepository.getByCognitoId(input.userCognitoId);
    if (user === null) {
      throw new NotFoundException('User');
    }
    if (user.deletedAt !== null) {
      throw new NotFoundException('User');
    }

    const issue: IssueDTO | null = await this.issueRepository.getById(input.issueId);
    if (issue === null || issue.deletedAt !== null) {
      throw new NotFoundException('Issue');
    }

    if (issue.assigneeId !== user.id) {
      throw new ForbiddenException();
    }

    return { user, issue };
  }

  /**
   * Parses blocker events and adds them to the list of parsed events.
   * @param blockEvents The list of blocker events to parse.
   * @param parsedEvents The list of parsed events to update.
   */
  private parseBlockEvents(blockEvents: BlockerStatusModificationDTO[], parsedEvents: EventHistoryLogDTO[]): void {
    blockEvents.forEach((event) =>
      parsedEvents.push(
        new EventHistoryLogDTO({
          message: event.reason,
          isBlocker: true,
          date: event.eventRegisteredAt ?? event.createdAt,
          eventId: event.id,
          comment: event.comment,
        })
      )
    );
  }

  /**
   * Parses change log events and adds them to the list of parsed events.
   * @param changeLogEvents The list of change log events to parse.
   * @param parsedEvents The list of parsed events to update.
   */
  private parseChangeLogEvents(changeLogEvents: IssueChangeLogDTO[], parsedEvents: EventHistoryLogDTO[]): void {
    changeLogEvents.forEach((event) => {
      let message: string;
      if (event.field !== 'state') {
        message = event.to === undefined ? 'Issue has been unassigned' : `Issue has been assigned to ${event.to}`;
      } else {
        message = event.to === undefined ? 'Issue has not any stage assigned' : `Issue stage has changed to ${event.to}`;
      }

      parsedEvents.push(
        new EventHistoryLogDTO({
          message,
          isBlocker: false,
          date: event.eventRegisteredAt ?? event.createdAt,
          eventId: event.id,
          comment: undefined,
        })
      );
    });
  }

  /**
   * Parses manual time modifications and adds them to the list of parsed events.
   * @param manualModifications The list of manual time modifications to parse.
   * @param parsedEvents The list of parsed events to update.
   */
  private parseManualTimeModifications(manualModifications: ManualTimeModificationDTO[], parsedEvents: EventHistoryLogDTO[]): void {
    manualModifications.forEach((event) =>
      parsedEvents.push(
        new EventHistoryLogDTO({
          message: event.reason,
          isBlocker: false,
          date: event.modificationDate,
          eventId: event.id,
          comment: undefined,
        })
      )
    );
  }

  /**
   * Parses time tracking events and adds them to the list of parsed events.
   * @param timeTrackingEvents The list of time tracking events to parse.
   * @param parsedEvents The list of parsed events to update.
   */
  private parseTimeTrackingEvents(timeTrackingEvents: TimeTrackingDTO[], parsedEvents: EventHistoryLogDTO[]): void {
    timeTrackingEvents.forEach((event) => {
      parsedEvents.push(
        new EventHistoryLogDTO({
          message: 'Time tracking has started',
          isBlocker: false,
          date: event.startTime,
          eventId: event.id,
          comment: undefined,
        })
      );

      if (event.endTime !== null) {
        parsedEvents.push(
          new EventHistoryLogDTO({
            message: 'Time tracking has been paused',
            isBlocker: false,
            date: event.endTime,
            eventId: event.id,
            comment: undefined,
          })
        );
      }
    });
  }
}
