import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { BlockEventData, ChangeScalarEventData, type EventData } from '@domains/event/dto';
import { type Organization, type User, type LinearError, type Team, type Issue, type IssueHistory, type WorkflowState } from '@linear/sdk';
import { processIssueEvents } from '@domains/adapter/linear/event-util';
import { decryptData, LinearIntegrationException, Logger } from '@utils';
import { IssueDataDTO, type Priority } from '@domains/issue/dto';
import { type AdaptProjectDataInput, type LinearIssueData } from '@domains/adapter/dto';
import { ProjectDataDTO, ProjectMemberDataDTO, ProjectPreIntegratedDTO, type StageData } from '@domains/integration/dto';
import { type LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';
import { type UserData } from '@domains/user';
import { type BasicProjectDataInput } from '@domains/project/dto';

import { type StageType } from '@domains/projectStage/dto';

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
      throw new LinearIntegrationException(400, linearError.message, linearError.errors);
    }
  }

  /**
   * Adapt Linear issue events for a given Linear issue ID to Tricker issue events.
   * @param issue - Issue from Linear
   * @param projectId - The ID of the Linear project
   * @returns {Promise<EventData[]>} A promise that resolves with an array of EventInput objects representing the issue events.
   * @throws {LinearIntegrationException} If there is an error while interacting with the Linear API.
   */
  // Retriever not configured because it has been already configured in the flow
  private async adaptIssueEventsData(issue: Issue, projectId: string): Promise<EventData[]> {
    try {
      const history: IssueHistory[] = await this.dataRetriever.getIssueHistory(issue);
      const project: Team = await this.dataRetriever.getTeam(projectId);
      const stages: WorkflowState[] = await this.dataRetriever.getStages(project);
      const members: User[] = await this.dataRetriever.getMembers(projectId);
      Logger.info(`Event nodes retrieved from issue ${issue.id}: ${history.length} -- ${new Date().toString()}`);
      const eventData = await processIssueEvents({ linearIssueId: issue.id, history, stages, members });
      Logger.complete(`Events from linear issue ${issue.id} have been adapted -- ${new Date().toString()}`);
      return eventData;
    } catch (err: any) {
      const linearError = err as LinearError;
      throw new LinearIntegrationException(400, linearError.message, linearError.errors);
    }
  }

  /**
   * Adapts project data using input parameters, decrypts token for authentication,
   * retrieves team details, filters members, and returns essential project information.
   * @param {AdaptProjectDataInput} input - Input data including token, project ID, project manager email, and member emails.
   * @returns {Promise<ProjectDataDTO>} A promise resolving with project-related data.
   * @throws {LinearIntegrationException} If there is an issue with authentication or retrieving project details.
   */
  async adaptProjectData(input: AdaptProjectDataInput): Promise<ProjectDataDTO> {
    const key: string = decryptData(input.token);
    this.dataRetriever.configureRetriever(key);
    const team: Team = await this.dataRetriever.getTeam(input.providerProjectId);
    const teamMembers: ProjectMemberDataDTO[] = await this.getMembersByProjectId(input.providerProjectId, key);
    const stages: StageData[] = await this.getAndAdaptStages(team);
    const labels: string[] = await this.getAndAdaptLabels(team);
    const org: Organization = await this.dataRetriever.getOrganization();
    const issues = await this.adaptAllProjectIssuesData(input.providerProjectId);

    return new ProjectDataDTO({
      projectId: input.providerProjectId,
      members: teamMembers,
      projectName: team.name,
      image: org.logoUrl ?? null,
      stages,
      labels,
      issues,
      url: `https://linear.app/${org.urlKey}`,
    });
  }

  /**
   * Adapts all project issues data including issue details, priorities, and labels.
   * @param {string} providerProjectId - Project's provider ID.
   * @returns {Promise<IssueDataDTO[]>} A promise resolving with project issues data.
   */
  // Retriever not configured because it has been already configured in the flow
  async adaptAllProjectIssuesData(providerProjectId: string): Promise<IssueDataDTO[]> {
    const issues: Issue[] = await this.dataRetriever.getIssues(providerProjectId);
    Logger.info(`Issues retrieved to be adapted ${issues.length} -- ${new Date().toString()}`);
    Logger.time('Issues integration');
    const integratedIssuesData: IssueDataDTO[] = [];
    for (const issue of issues) {
      const issueData: LinearIssueData = await this.dataRetriever.getIssueData(issue);
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

      const events = await this.adaptIssueEventsData(issue, providerProjectId);

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
          blockingEvents: events.filter((event) => event instanceof BlockEventData) as BlockEventData[],
          issueChangeLogEvents: events.filter((event) => event instanceof ChangeScalarEventData) as ChangeScalarEventData[],
        })
      );
    }
    Logger.timeEnd(`Issues integration`);
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
   * @returns {Promise<string[]>} A promise resolving with project stage names.
   * @param project
   */
  private async getAndAdaptStages(project: Team): Promise<StageData[]> {
    return (await this.dataRetriever.getStages(project)).map((stage) => {
      let type: StageType;
      switch (stage.type) {
        case 'backlog':
          type = 'BACKLOG';
          break;
        case 'unstarted':
          type = 'UNSTARTED';
          break;
        case 'started':
          type = 'STARTED';
          break;
        case 'completed':
          type = 'COMPLETED';
          break;
        case 'canceled':
          type = 'CANCELED';
          break;
        default:
          type = 'OTHER';
      }

      return { type, name: stage.name, position: stage.position, color: stage.color };
    });
  }

  /**
   * Retrieves and adapts project labels by ID.
   * @returns {Promise<string[]>} A promise resolving with project label names.
   * @param project
   */
  private async getAndAdaptLabels(project: Team): Promise<string[]> {
    return (await this.dataRetriever.getLabels(project)).map((label) => label.name);
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

  async getMemberById(memberId: string, apiKey: string): Promise<UserData> {
    this.dataRetriever.configureRetriever(apiKey);
    const user = await this.dataRetriever.getUser(memberId);

    return { name: user.name, email: user.email, image: user.avatarUrl ?? null };
  }

  async getProjectById(projectId: string, apiKey: string): Promise<BasicProjectDataInput> {
    this.dataRetriever.configureRetriever(apiKey);
    const team = await this.dataRetriever.getTeam(projectId);
    const org = await this.dataRetriever.getOrganization();

    return { name: team.name, id: projectId, projectImage: org.logoUrl, projectUrl: `https://linear.app/${org.urlKey}` };
  }
}
