import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { ConflictException, LinearIntegrationException } from '@utils';
import { type RoleRepository } from '@domains/role/repository';
import { LinearClient, type LinearError, type Organization, type Team, type User, type UserConnection } from '@linear/sdk';
import { type RoleDTO } from '@domains/role/dto';
import { IssueDataDTO, type Priority } from '@domains/issue/dto';
import { processIssueEvents } from '@domains/adapter/linear/event-util';
import { type EventInput } from '@domains/event/dto';
import process from 'process';
import { ProjectMemberDataDTO } from '@domains/integration/dto';

export class LinearAdapter implements ProjectManagementTool {
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * Retrieves members(users) asociated with a Linear project identified by its Linear project ID and adapt them.
   * @param {string} linearProjectId - The ID of the Linear project.
   * @returns {Promise<ProjectMemberDataDTO[]>} A promise that resolves with an array of ProjectMemberDTO objects representing the project members.
   * @throws {LinearIntegrationException} If there is an error while interacting with the Linear API.
   */
  async getMembersByProjectId(linearProjectId: string): Promise<ProjectMemberDataDTO[]> {
    const linearClient = new LinearClient({
      apiKey: process.env.LINEAR_SECRET,
    });

    try {
      const team = await linearClient.team(linearProjectId);
      const members = await team.members();
      return members.nodes.map(
        (member) =>
          new ProjectMemberDataDTO({
            providerId: member.id,
            name: member.name,
            email: member.email,
          })
      );
    } catch (err: any) {
      const linearError = err as LinearError;
      throw new LinearIntegrationException(linearError.message, linearError.errors);
    }
  }

  /**
   * Adapt Linear issue events for a given Linear issue ID to Tricker issue events.
   * @param {string} linearIssueId - The ID of the Linear issue.
   * @returns {Promise<EventInput[]>} A promise that resolves with an array of EventInput objects representing the issue events.
   * @throws {LinearIntegrationException} If there is an error while interacting with the Linear API.
   */
  async integrateIssueEvents(linearIssueId: string): Promise<EventInput[]> {
    const linearClient = new LinearClient({
      apiKey: process.env.LINEAR_SECRET,
    });

    try {
      const issue = await linearClient.issue(linearIssueId);
      return await processIssueEvents(issue);
    } catch (err: any) {
      const linearError = err as LinearError;
      throw new LinearIntegrationException(linearError.message, linearError.errors);
    }
  }

  async integrateProjectData(linearProjectId: string, pmEmail: string): Promise<ProjectDataDTO> {
    const linearClient = new LinearClient({
      apiKey: process.env.LINEAR_SECRET,
    });
    const team: Team = await linearClient.team(linearProjectId);
    const members: UserConnection = await team.members();
    const stages: string[] = (await team.states()).nodes.map((stage) => stage.name);
    const pm: User | undefined = members.nodes.find((member) => member.email === pmEmail);
    if (pm == null) {
      throw new ConflictException('Provided Project Manager ID not correct.');
    }
    let pmRole: RoleDTO | null = await this.roleRepository.getByName('Project Manager');
    if (pmRole == null) {
      pmRole = await this.roleRepository.create('Project Manager');
    }
    let dev: RoleDTO | null = await this.roleRepository.getByName('Developer');
    if (dev == null) {
      dev = await this.roleRepository.create('Developer');
    }
    let role: string;
    const teamMembers: UserRole[] = members.nodes.map((member) => {
      if (pmRole != null && dev != null) {
        role = member.email === pmEmail ? pmRole.id : dev.id;
      }
      return new UserRole({ email: member.email, role });
    });
    const org: Organization = await linearClient.organization;

    return new ProjectDataDTO(linearProjectId, teamMembers, team.name, stages, org.logoUrl ?? null);
  }

  async integrateAllProjectIssuesData(providerProjectId: string): Promise<IssueDataDTO[]> {
    const linearClient = new LinearClient({
      apiKey: process.env.LINEAR_SECRET,
    });
    const project: Team = await linearClient.team(providerProjectId);
    const issues = await project.issues();
    const integratedIssuesData: IssueDataDTO[] = [];
    for (const issue of issues.nodes) {
      const stage = await issue.state;
      const creator = await issue.creator;
      const assignee = await issue.assignee;
      let priority: Priority;
      switch (issue.priority) {
        case 1:
          priority = 'URGENT';
          break;
        case 2:
          priority = 'HIGH_PRIORITY';
          break;
        case 3:
          priority = 'MEDIUM_PRIORITY';
          break;
        case 4:
          priority = 'LOW_PRIORITY';
          break;
        default:
          priority = 'NO_PRIORITY';
      }

      integratedIssuesData.push(
        new IssueDataDTO({
          providerIssueId: issue.id,
          authorEmail: creator !== undefined ? creator.email : null,
          assigneeEmail: assignee !== undefined ? assignee.email : null,
          providerProjectId,
          name: issue.identifier,
          title: issue.title,
          description: issue.description ?? null,
          priority,
          storyPoints: issue.estimate ?? null,
          stage: stage != null ? stage.name : null,
        })
      );
    }

    return integratedIssuesData;
  }
}
