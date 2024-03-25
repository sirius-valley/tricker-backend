import { type ProjectService } from '@domains/project/service/project.service';
import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type ProjectDTO } from '@domains/project/dto';
import { type StageExtendedDTO } from '@domains/stage/dto';
import { type IssueRepository, type IssueViewDTO, type Priority, type UserProject } from '@domains/issue';
import { type AssigneeFilterDataDTO, type UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { NotFoundException } from '@utils';

export class ProjectServiceImpl implements ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly issueRepository: IssueRepository,
    private readonly userRepository: UserRepository
  ) {}

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

    return { stages: filteredStages, assignees: filteredAssignees, priorities: filteredPriorities };
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
