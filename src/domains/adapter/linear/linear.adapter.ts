import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type EventInput } from '@domains/event/dto';
import { type IssueLabel, LinearClient, type Organization, type User, type WorkflowState, type LinearError, type Team } from '@linear/sdk';
import { processIssueEvents } from '@domains/adapter/linear/event-util';
import { ConflictException, decryptData, LinearIntegrationException } from '@utils';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { IssueDataDTO } from '@domains/issue/dto';
import { type Priority } from '@prisma/client';
import process from 'process';
import { linearClient } from '@context';
import { type AdaptProjectDataInputDTO } from '@domains/adapter/dto';

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
    if (linearClient !== undefined) return;
    this.apiKey = apiKey;
    this.linearClient = this.initializeLinearClient();
  }

  /**
   * Integrates issue events for a given Linear issue ID.
   * @param {string} linearIssueId - The ID of the Linear issue.
   * @returns {Promise<EventInput[]>} A promise that resolves with an array of EventInput objects representing the issue events.
   * @throws {LinearIntegrationException} If there is an issue with retrieving the issue details or processing the events.
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
    const key = decryptData(input.token, process.env.ENCRYPT_SECRET!);
    this.setKey(key);
    if (this.linearClient === undefined) {
      throw new LinearIntegrationException('Linear Client not created');
    }
    const team: Team = await this.linearClient.team(input.providerProjectId);
    const members: User[] = (await team.members()).nodes.filter((member: User): boolean => input.memberMails.find((email: string): boolean => email === member.email) !== undefined);
    const stages: string[] = (await team.states()).nodes.map((stage: WorkflowState) => stage.name);
    const pm: User | undefined = members.find((member: User): boolean => member.email === input.pmEmail);
    if (pm == null) {
      throw new ConflictException('Provided Project Manager ID not correct.');
    }
    const teamMembers: UserRole[] = members.map((member: User) => {
      const role: string = member.email === input.pmEmail ? 'Project Manager' : 'Developer';
      return new UserRole({ email: member.email, role });
    });
    const labels: string[] = (await team.labels()).nodes.map((label: IssueLabel) => label.name);
    const org: Organization = await linearClient.organization;

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
}
