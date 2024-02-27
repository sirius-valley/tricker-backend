import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type PendingAuthProjectRepository } from '@domains/pendingAuthProject/repository';
import { type EventInput } from '@domains/event/dto';
import { type IssueLabel, LinearClient, type Organization, type User, type WorkflowState, type LinearError, type Team } from '@linear/sdk';
import { processIssueEvents } from '@domains/adapter/linear/event-util';
import { ConflictException, decryptData, LinearIntegrationException, NotFoundException } from '@utils';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { type PendingAuthProjectDTO } from '@domains/pendingAuthProject/dto';
import { IssueDataDTO } from '@domains/issue/dto';
import { type Priority } from '@prisma/client';

export class LinearAdapter implements ProjectManagementTool {
  constructor(private readonly pendingAuthProject: PendingAuthProjectRepository) {}

  /**
   * Integrates issue events for a given Linear issue ID.
   * @param {string} linearIssueId - The ID of the Linear issue.
   * @returns {Promise<EventInput[]>} A promise that resolves with an array of EventInput objects representing the issue events.
   * @throws {LinearIntegrationException} If there is an issue with retrieving the issue details or processing the events.
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
    const pendingProject: PendingAuthProjectDTO | null = await this.pendingAuthProject.getByProjectId(linearProjectId);
    if (pendingProject === null) {
      throw new NotFoundException('PendingAuthProject');
    }
    const linearClient: LinearClient = new LinearClient({
      apiKey: decryptData(pendingProject.projectToken, process.env.ENCRYPT_SECRET!),
    });
    const team: Team = await linearClient.team(linearProjectId);
    const members: User[] = (await team.members()).nodes.filter((member: User): boolean => pendingProject.memberMails.find((email: string): boolean => email === member.email) !== undefined);
    const stages: string[] = (await team.states()).nodes.map((stage: WorkflowState) => stage.name);
    const pm: User | undefined = members.find((member: User): boolean => member.email === pmEmail);
    if (pm == null) {
      throw new ConflictException('Provided Project Manager ID not correct.');
    }
    const teamMembers: UserRole[] = members.map((member: User) => {
      const role: string = member.email === pmEmail ? 'Project Manager' : 'Developer';
      return new UserRole({ email: member.email, role });
    });
    const labels: string[] = (await team.labels()).nodes.map((label: IssueLabel) => label.name);
    const org: Organization = await linearClient.organization;

    return new ProjectDataDTO(linearProjectId, teamMembers, team.name, stages, labels, org.logoUrl ?? null);
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
