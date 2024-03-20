import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';
import { type EventRepository } from '@domains/event/repository';
import { type ManualTimeModificationDTO, type TimeTrackingDTO, UpdateTimeTracking } from '@domains/event/dto';
import { ConflictException, NotFoundException } from '@utils';
import { type DevIssueFilterParameters, type IssueDTO, type IssueViewDTO, type PMIssueFilterParameters, type WorkedTimeDTO } from '@domains/issue/dto';
import { getTimeTrackedInSeconds } from '@utils/date-service';
import { type UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectDTO } from '@domains/project/dto';
import { type ProjectStageRepository } from '@domains/projectStage/repository';

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

    const isIssueInStartedStage: boolean = await this.isIssueInStartedStage(issue);
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
   * @param {Object} params - Parameters for checking the issue's stage.
   * @param {string | null} params.stageId - The ID of the current stage of the issue.
   * @param {string} params.projectId - The ID of the project the issue belongs to.
   * @returns {Promise<boolean>} A promise that resolves to true if the issue is in a started stage, otherwise false.
   */
  private async isIssueInStartedStage({ stageId, projectId }: { stageId: string | null; projectId: string }): Promise<boolean> {
    if (stageId == null) return false;
    const projectStage = await this.projectStageRepository.getByProjectIdAndStageId({
      stageId,
      projectId,
    });

    return projectStage != null && projectStage.type === 'STARTED';
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
    const user: UserDTO | null = await this.userRepository.getById(filters.userId);
    if (user === null) {
      throw new NotFoundException('User');
    }
    if (user.cognitoId === null) {
      throw new NotFoundException('User');
    }

    if (filters.projectId !== undefined) {
      const project: ProjectDTO | null = await this.projectRepository.getById(filters.projectId);
      if (project === null) {
        throw new NotFoundException('Project');
      }
    }

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
}
