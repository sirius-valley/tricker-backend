import { type ProjectService } from '@domains/project/service/project.service';
import { type DevProjectFiltersDTO, type MyProjectViewDTO, type PMProjectFiltersDTO, type ProjectDetailsDTO, type ProjectDTO, ProjectRole, type ProjectBasicDTO, type ProjectsFilterInput } from '@domains/project/dto';
import { type IssueRepository, type IssueViewDTO, type Priority, priorityOrder, type UserProject } from '@domains/issue';
import { type AssigneeFilterDataDTO, type UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { NotFoundException } from '@utils';
import { StageDTO, type StageExtendedDTO, StageTypeOrder } from '@domains/projectStage/dto';
import { type UserRoleDTO } from '@domains/userProjectRole/dto';

export class ProjectServiceImpl implements ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly issueRepository: IssueRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Fetches detailed information about a specific project.
   *
   * @param input - An object containing user ID and project ID for lookup.
   * @param {string} input.userId - ID of the user requesting project information.
   * @param {string} input.projectId - ID of the project to retrieve details for.
   * @returns {Promise<MyProjectViewDTO>} - Promise resolving to a ProjectViewDTO object with project details.
   * @throws {NotFoundException} - Throws NotFoundException with specific messages:
   *                                 * 'User': If the user with the provided ID is not found.
   *                                 * 'Project': If the project with the provided ID is not found or the user doesn't have access to it.
   */
  async getMyProjectView({ userId, projectId }: { userId: string; projectId: string }): Promise<MyProjectViewDTO> {
    const user = await this.userRepository.getByCognitoId(userId);
    if (user == null) throw new NotFoundException('User');

    const project: ProjectDetailsDTO | null = await this.projectRepository.getProjectDetails(user.id, projectId);
    if (project == null) throw new NotFoundException('Project');

    const pmUserAndRole: UserRoleDTO | undefined = project.usersAndRoles.find((userAndRole) => userAndRole.role.name === ProjectRole.PROJECT_MANAGER);
    const currentUserIsPm: boolean = pmUserAndRole !== undefined && pmUserAndRole.user.id === user.id;

    return {
      providerId: project.providerId,
      image: project.image,
      url: project.url,
      name: project.name,
      issueProviderName: project.issueProvider.name,
      updatedAt: project.updatedAt,
      users: project.usersAndRoles.map((userAndRole) => ({
        name: userAndRole.user.name,
        email: userAndRole.user.email,
        image: userAndRole.user.profileImage,
        role: currentUserIsPm ? userAndRole.role : undefined,
      })),
    };
  }

  /**
   * Retrieves development project filters based on the provided user and project IDs.
   * @param {UserProject} input - The project and user IDs.
   * @returns {Promise<DevProjectFiltersDTO>} The retrieved project filters.
   * @throws {NotFoundException} If the user or project is not found.
   */
  async getDevProjectFilters(input: UserProject): Promise<DevProjectFiltersDTO> {
    await this.validateProjectExistence(input.projectId);
    const user: UserDTO | null = await this.userRepository.getByCognitoId(input.userId);
    if (user === null || user.deletedAt !== null) {
      throw new NotFoundException('User');
    }
    const issues: IssueViewDTO[] = await this.issueRepository.getByProjectIdAndUserId({ userId: user.id, projectId: input.projectId });
    const filters: PMProjectFiltersDTO = this.getFilters(issues);

    return { priorities: filters.priorities, stages: filters.stages };
  }

  /**
   * Retrieves project filters for a project manager based on the specified project ID.
   * @param {string} projectId - The ID of the project.
   * @returns {Promise<PMProjectFiltersDTO>} The project filters for a project manager.
   */
  async getPMProjectFilters(projectId: string): Promise<PMProjectFiltersDTO> {
    await this.validateProjectExistence(projectId); // user already validated in Pm validation middleware
    const issues: IssueViewDTO[] = await this.issueRepository.getByProjectId(projectId);

    return this.getFilters(issues);
  }

  /**
   * Retrieves a filtered list of projects for a user.
   * @param input - The input object containing the filter criteria.
   * @returns An array of ProjectBasicDTO objects representing the filtered projects.
   * @throws NotFoundException when the user is not found or deleted.
   */
  async getProjectsListByUserIdFiltered(input: ProjectsFilterInput): Promise<ProjectBasicDTO[]> {
    const user: UserDTO | null = await this.userRepository.getById(input.userId);
    if (user === null || user.deletedAt !== null) {
      throw new NotFoundException('User');
    }

    return await this.projectRepository.getProjectsByUserId(input);
  }

  /**
   * Extracts project filters from the provided list of issues.
   * @param {IssueViewDTO[]} issues - The list of issues.
   * @returns {PMProjectFiltersDTO} The project filters extracted from the issues.
   * @private
   */
  private getFilters(issues: IssueViewDTO[]): PMProjectFiltersDTO {
    const stages: StageExtendedDTO[] = [];
    const priorities: Priority[] = [];
    const assignees: AssigneeFilterDataDTO[] = [];

    for (const issue of issues) {
      if (issue.stage !== null) {
        stages.push(issue.stage);
      }
      priorities.push(issue.priority);
      if (issue.assignee !== null) {
        assignees.push({ id: issue.assignee.id, name: issue.assignee.name! });
      }
    }

    const filteredStages: StageExtendedDTO[] = [];
    stages.reduce((acum: StageExtendedDTO[], current: StageExtendedDTO) => {
      if (!acum.some((stage) => stage.id === current.id)) {
        acum.push(current);
      }
      return acum;
    }, filteredStages);
    const filteredPriorities: Priority[] = [];
    priorities.reduce((acum: Priority[], current: Priority) => {
      if (!acum.some((priority) => priority === current)) {
        acum.push(current);
      }
      return acum;
    }, filteredPriorities);
    const filteredAssignees: AssigneeFilterDataDTO[] = [];
    assignees.reduce((acum: AssigneeFilterDataDTO[], current: AssigneeFilterDataDTO) => {
      if (!acum.some((assignee) => assignee.id === current.id)) {
        acum.push(current);
      }
      return acum;
    }, filteredAssignees);

    return {
      stages: filteredStages
        .sort((a, b) => {
          if (a.type !== b.type) {
            return StageTypeOrder[a.type] - StageTypeOrder[b.type];
          }
          return a.position - b.position;
        })
        .map((stage) => new StageDTO(stage)),
      assignees: filteredAssignees.sort((a, b) => a.name.localeCompare(b.name)),
      priorities: filteredPriorities
        .sort((a, b) => priorityOrder[a] - priorityOrder[b])
        .map((priority) =>
          priority
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        ),
    };
  }

  /**
   * Validates the existence of a project.
   * @param {string} projectId - The ID of the project to validate.
   * @returns {Promise<ProjectDTO>} The project if found.
   * @throws {NotFoundException} If the project is not found.
   */
  private async validateProjectExistence(projectId: string): Promise<ProjectDTO> {
    const project: ProjectDTO | null = await this.projectRepository.getById(projectId);
    if (project === null || project.deletedAt !== null) {
      throw new NotFoundException('Project');
    }

    return project;
  }
}
