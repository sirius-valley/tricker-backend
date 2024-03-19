import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';
import { type EventRepository } from '@domains/event/repository';
import { type IssueAddBlockerInput, type ManualTimeModificationDTO, type TimeTrackingDTO, TrickerBlockEventType, UpdateTimeTracking } from '@domains/event/dto';
import { ConflictException, ForbiddenException, NotFoundException } from '@utils';
import { type DevIssueFilterParameters, type IssueAndAssignee, type IssueDetailsDTO, type IssueDTO, IssueExtendedDTO, type IssueViewDTO, type PMIssueFilterParameters, type UserProject, type WorkedTimeDTO } from '@domains/issue/dto';
import { getTimeTrackedInSeconds } from '@utils/date-service';
import { type UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectDTO } from '@domains/project/dto';
import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { type RoleRepository } from '@domains/role/repository';
import { type RoleDTO } from '@domains/role/dto';

export class IssueServiceImpl implements IssueService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userProjectRoleRepository: UserProjectRoleRepository,
    private readonly roleRepository: RoleRepository
  ) {}

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

    return this.getIssuesFilteredAndPaginated(filters);
  }

  /**
   * Retrieves a list of filtered and paginated issues based on the provided filters.
   * @param filters - Parameters used for filtering issues.
   * @returns An array of IssueViewDTO objects representing the filtered and paginated issues.
   * @throws {NotFoundException} If the user or project is not found.
   * @throws {ForbiddenException} If the user is not the Project Manager.
   */
  async getPMIssuesFilteredAndPaginated(filters: PMIssueFilterParameters): Promise<IssueViewDTO[]> {
    const user: UserDTO = await this.validateUserExistence(filters.userId);
    const project: ProjectDTO = await this.validateProjectExistence(filters.projectId);
    const role: RoleDTO = await this.getUserRole({ projectId: project.id, userId: user.id });
    if (role.name !== 'Project Manager') {
      throw new ForbiddenException();
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

  async blockIssueWithTrickerUI(input: IssueAddBlockerInput): Promise<IssueExtendedDTO> {
    const user: UserDTO = await this.validateIssueAndAssignee({ issueId: input.issueId, userCognitoId: input.userCognitoId });

    await this.eventRepository.createIssueBlockEvent({
      issueId: input.issueId,
      userEmitterId: user.id,
      reason: input.reason,
      comment: input.comment,
      createdAt: new Date(),
      providerEventId: null,
      type: TrickerBlockEventType.BLOCKED_BY,
    });

    const issue: IssueDetailsDTO = await this.issueRepository.updateIsBlocked({ issueId: input.issueId, isBlocked: true });
    // TODO: will create chronology logic in issue TRI-149
    return new IssueExtendedDTO({ ...issue, chronology: [] });
  }

  async unblockIssueWithTrickerUI(input: IssueAndAssignee): Promise<IssueExtendedDTO> {
    const user: UserDTO = await this.validateIssueAndAssignee({ issueId: input.issueId, userCognitoId: input.userCognitoId });
    const issue: IssueDTO = (await this.issueRepository.getById(input.issueId))!;
    await this.eventRepository.createIssueBlockEvent({
      issueId: input.issueId,
      userEmitterId: user.id,
      reason: `Unblocked by user ${user.name}.`,
      comment: `Issue ${issue.name} unblocked.`,
      createdAt: new Date(),
      providerEventId: null,
      type: TrickerBlockEventType.BLOCKED_BY,
    });

    const updatedIssue: IssueDetailsDTO = await this.issueRepository.updateIsBlocked({ issueId: input.issueId, isBlocked: false });
    // TODO: will create chronology logic in issue TRI-149
    return new IssueExtendedDTO({ ...updatedIssue, chronology: [] });
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
   * Retrieves the role of a user in a project.
   * Throws a NotFoundException if the user's role in the project is not found.
   * @param input - The UserProject object containing the project ID and user ID.
   * @returns A Promise resolving to a RoleDTO object representing the user's role in the project.
   * @throws NotFoundException if the user's role in the project is not found.
   */
  private async getUserRole(input: UserProject): Promise<RoleDTO> {
    const userProjectRole: UserProjectRoleDTO | null = await this.userProjectRoleRepository.getByProjectIdAndUserId(input);
    if (userProjectRole === null) {
      throw new NotFoundException('UserProjectRole');
    }
    const role: RoleDTO | null = await this.roleRepository.getById(userProjectRole.roleId);
    if (role === null) {
      throw new NotFoundException('Role');
    }

    return role;
  }

  private async validateIssueAndAssignee(input: IssueAndAssignee): Promise<UserDTO> {
    const user: UserDTO | null = await this.userRepository.getByCognitoId(input.userCognitoId);
    if (user === null) {
      throw new NotFoundException('User');
    }

    const issue: IssueDTO | null = await this.issueRepository.getById(input.issueId);
    if (issue === null) {
      throw new NotFoundException('Issue');
    }

    if (issue.assigneeId !== user.id) {
      throw new ForbiddenException();
    }

    return user;
  }
}
