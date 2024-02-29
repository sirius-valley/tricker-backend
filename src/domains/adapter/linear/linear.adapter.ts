import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type EventInput } from '@domains/event/dto';
import { type IssueLabel, LinearClient, type Organization, type User, type WorkflowState, type LinearError, type Team } from '@linear/sdk';
import { processIssueEvents } from '@domains/adapter/linear/event-util';
import { ConflictException, decryptData, LinearIntegrationException } from '@utils';
import { UserRole } from '@domains/project/dto';
import { IssueDataDTO, type Priority } from '@domains/issue/dto';
import process from 'process';
import { type AdaptProjectDataInputDTO } from '@domains/adapter/dto';
import { ProjectMemberDataDTO, ProjectDataDTO } from '@domains/integration/dto';

export class LinearAdapter implements ProjectManagementToolAdapter {
  private linearClient?: LinearClient;
  private apiKey?: string;

  private initializeLinearClient(): LinearClient {
    if (this.apiKey === null) {
      throw new LinearIntegrationException('API key not set.');
    }
    return new LinearClient({
      apiKey: this.apiKey,
    });
  }

  setKey(apiKey: string): void {
    if (this.linearClient !== undefined) return;
    this.apiKey = apiKey;
    this.linearClient = this.initializeLinearClient();
  }

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
  async adaptIssueEventsData(linearIssueId: string): Promise<EventInput[]> {
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

  /**
   * Adapts project data using input parameters, decrypts token for authentication,
   * retrieves team details, filters members, and returns essential project information.
   * @param {AdaptProjectDataInputDTO} input - Input data including token, project ID, project manager email, and member emails.
   * @returns {Promise<ProjectDataDTO>} A promise resolving with project-related data.
   * @throws {LinearIntegrationException} If there is an issue with authentication or retrieving project details.
   */
  async adaptProjectData(input: AdaptProjectDataInputDTO): Promise<ProjectDataDTO> {
    const key = decryptData(input.token);
    this.setKey(key);
    if (this.linearClient === undefined) {
      throw new LinearIntegrationException('Linear Client not created');
    }
    const team: Team = await this.linearClient.team(input.providerProjectId);
    const members: User[] = (await team.members()).nodes.filter((member: User): boolean => input.memberMails.find((email: string): boolean => email === member.email) !== undefined);
    const stages: string[] = await this.getStages(team);
    const pm: User | undefined = members.find((member: User): boolean => member.email === input.pmEmail);
    if (pm === undefined) {
      throw new ConflictException('Provided Project Manager email not correct.');
    }
    const teamMembers: UserRole[] = await this.assignRoles(members, input.pmEmail);
    const labels: string[] = await this.getLabels(team);
    const org: Organization = await this.linearClient.organization;

    return new ProjectDataDTO(input.providerProjectId, teamMembers, team.name, stages, labels, org.logoUrl ?? null);
  }

  async adaptAllProjectIssuesData(providerProjectId: string): Promise<IssueDataDTO[]> {
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

  private async getStages(team: Team): Promise<string[]> {
    return (await team.states()).nodes.map((stage: WorkflowState) => stage.name);
  }

  private async getLabels(team: Team): Promise<string[]> {
    return (await team.labels()).nodes.map((label: IssueLabel) => label.name);
  }

  private async assignRoles(members: User[], pmEmail: string): Promise<UserRole[]> {
    return members.map((member: User) => {
      const role: string = member.email === pmEmail ? 'Project Manager' : 'Developer';
      return new UserRole({ email: member.email, role });
    });
  }
}
