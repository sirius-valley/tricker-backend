import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type EventInput } from '@domains/event/dto';
import { type Organization, type User, type LinearError, type Team, type Issue, type IssueHistory } from '@linear/sdk';
import { processIssueEvents } from '@domains/adapter/linear/event-util';
import { decryptData, LinearIntegrationException } from '@utils';
import { IssueDataDTO, type Priority } from '@domains/issue/dto';
import process from 'process';
import { type AdaptProjectDataInputDTO, type LinearIssueData } from '@domains/adapter/dto';
import { ProjectDataDTO, ProjectMemberDataDTO, ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';

export class LinearAdapter implements ProjectManagementToolAdapter {
  constructor(private readonly dataRetriever: LinearDataRetriever) {}

  /**
   * Retrieves members(users) associated with a Linear project identified by its Linear project ID and adapt them.
   * @param {string} linearProjectId - The ID of the Linear project.
   * @param {string} apiKey - The API key from Linear.
   * @returns {Promise<ProjectMemberDataDTO[]>} A promise that resolves with an array of ProjectMemberDTO objects representing the project members.
   * @throws {LinearIntegrationException} If there is an error while interacting with the Linear API.
   */
  async getMembersByProjectId(linearProjectId: string, apiKey: string): Promise<ProjectMemberDataDTO[]> {
    this.dataRetriever.configureRetriever(apiKey);
    try {
      const members: User[] = await this.dataRetriever.getMembers(linearProjectId);
      return members.map(
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
  // Retriever not configured because it has been already configured in the flow
  async adaptIssueEventsData(linearIssueId: string): Promise<EventInput[]> {
    try {
      const issue: Issue = await this.dataRetriever.getIssue(linearIssueId);
      const history: IssueHistory[] = await this.dataRetriever.getIssueHistory(linearIssueId);
      return await processIssueEvents(issue, history);
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
    const key: string = decryptData(input.token, process.env.ENCRYPT_SECRET!);
    this.dataRetriever.configureRetriever(key);
    const team: Team = await this.dataRetriever.getTeam(input.providerProjectId);
    const teamMembers: ProjectMemberDataDTO[] = await this.getMembersByProjectId(input.providerProjectId, key);
    const stages: string[] = await this.getAndAdaptStages(input.providerProjectId);
    const labels: string[] = await this.getAndAdaptLabels(input.providerProjectId);
    const org: Organization = await this.dataRetriever.getOrganization();

    return new ProjectDataDTO(input.providerProjectId, teamMembers, team.name, stages, labels, org.logoUrl ?? null);
  }

  /**
   * Adapts all project issues data including issue details, priorities, and labels.
   * @param {string} providerProjectId - Project's provider ID.
   * @returns {Promise<IssueDataDTO[]>} A promise resolving with project issues data.
   */
  // Retriever not configured because it has been already configured in the flow
  async adaptAllProjectIssuesData(providerProjectId: string): Promise<IssueDataDTO[]> {
    const issues: Issue[] = await this.dataRetriever.getIssues(providerProjectId);
    const integratedIssuesData: IssueDataDTO[] = [];
    for (const issue of issues) {
      const issueData: LinearIssueData = await this.dataRetriever.getIssueData(providerProjectId);
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
          authorEmail: issueData.creator !== undefined ? issueData.creator.email : null,
          assigneeEmail: issueData.assignee !== undefined ? issueData.assignee.email : null,
          providerProjectId,
          name: issue.identifier,
          title: issue.title,
          description: issue.description ?? null,
          priority,
          storyPoints: issue.estimate ?? null,
          stage: issueData.stage != null ? issueData.stage.name : null,
          labels: issueData.labels.map((label) => label.name),
        })
      );
    }

    return integratedIssuesData;
  }

  /**
   * Retrieves and adapts projects including their names and logos.
   * @returns {Promise<ProjectPreIntegratedDTO[]>} A promise resolving with pre-integrated projects.
   */
  async getAndAdaptProjects(): Promise<ProjectPreIntegratedDTO[]> {
    const teams: Team[] = await this.dataRetriever.getProjects();
    const workspace: Organization = await this.dataRetriever.getOrganization();
    return teams.map((project) => new ProjectPreIntegratedDTO({ providerProjectId: project.id, name: project.name, image: workspace.logoUrl ?? null }));
  }

  /**
   * Retrieves and adapts project stages by ID.
   * @param {string} providerProjectId - Project's provider ID.
   * @returns {Promise<string[]>} A promise resolving with project stage names.
   */
  private async getAndAdaptStages(providerProjectId: string): Promise<string[]> {
    return (await this.dataRetriever.getStages(providerProjectId)).map((stage) => stage.name);
  }

  /**
   * Retrieves and adapts project labels by ID.
   * @param {string} providerProjectId - Project's provider ID.
   * @returns {Promise<string[]>} A promise resolving with project label names.
   */
  private async getAndAdaptLabels(providerProjectId: string): Promise<string[]> {
    return (await this.dataRetriever.getLabels(providerProjectId)).map((label) => label.name);
  }

  /**
   * Retrieves the current user's email using an API key.
   * @param {string} apiKey - API key for authentication.
   * @returns {Promise<string>} A promise resolving with the current user's email.
   */
  async getMyEmail(apiKey: string): Promise<string> {
    this.dataRetriever.configureRetriever(apiKey);
    return await this.dataRetriever.getMyMail();
  }
}
