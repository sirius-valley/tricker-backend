import { type ProjectService } from '@domains/project/service/project.service';
import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type ProjectDTO, ProjectRole, type ProjectUserViewDTO, type ProjectViewDTO } from '@domains/project/dto';
import { type IssueRepository, type IssueViewDTO, type Priority, priorityOrder, type UserProject } from '@domains/issue';
import { type AssigneeFilterDataDTO, type UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { NotFoundException } from '@utils';
import { StageDTO, type StageExtendedDTO, StageTypeOrder } from '@domains/projectStage/dto';
import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type IssueProviderRepository } from '@domains/issueProvider/repository';
import { type IssueProviderDTO } from '@domains/issueProvider/dto';

export class ProjectServiceImpl implements ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly issueRepository: IssueRepository,
    private readonly userRepository: UserRepository,
    private readonly userProjectRoleRepository: UserProjectRoleRepository,
    private readonly issueProviderRepository: IssueProviderRepository
  ) {}

  /**
   * Retrieves information about projects and its members, associated with a given user and its role.
   *
   * @param {string} userId - ID of the user to retrieve project information for.
   * @returns {Promise<ProjectViewDTO[]>} - Promise resolving to an array of ProjectViewDTO objects representing the user's projects.
   * @throws {NotFoundException} - Throws an error if the user is not found.
   */
  async getMyProjectInfo(userId: string): Promise<ProjectViewDTO[]> {
    const user = await this.userRepository.getById(userId);
    if (user == null) throw new NotFoundException('User');

    const views: ProjectViewDTO[] = [];

    const userProjectRoleByUser = await this.userProjectRoleRepository.getUserRolesByUserAndOrProject({ userId });
    for (const upr of userProjectRoleByUser) {
      const issueProvider: IssueProviderDTO | null = await this.issueProviderRepository.getById(upr.project.issueProviderId);
      const userProjectRoleByProject = await this.userProjectRoleRepository.getUserRolesByUserAndOrProject({ projectId: upr.project.id });
      const userViews: ProjectUserViewDTO[] = userProjectRoleByProject.map((uprByProject) => ({
        name: uprByProject.user.name,
        email: uprByProject.user.email,
        image: uprByProject.user.profileImage,
        role: upr.role.name === ProjectRole.PROJECT_MANAGER ? uprByProject.role : undefined,
      }));

      views.push({
        providerId: upr.project.providerId,
        image: upr.project.image,
        url: upr.project.url,
        name: upr.project.name,
        issueProviderName: issueProvider!.name,
        updatedAt: upr.project.updatedAt,
        users: userViews,
      });
    }

    return views;
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
