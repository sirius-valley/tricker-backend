import { type Issue, type IssueHistory, type IssueLabel, LinearClient, type Organization, type Team, type User, type WorkflowState } from '@linear/sdk';
import { LinearIntegrationException } from '@utils';
import { type LinearIssueData } from '@domains/adapter/dto';

export class LinearDataRetriever {
  private linearClient: LinearClient | undefined;
  private apiKey: string | undefined;

  configureRetriever(apiKey: string): void {
    if (this.apiKey !== apiKey) {
      this.linearClient = new LinearClient({ apiKey });
    }
    this.apiKey = apiKey;
  }

  async getTeam(projectId: string): Promise<Team> {
    if (this.linearClient === undefined) throw new LinearIntegrationException('Linear client undefined');
    return await this.linearClient.team(projectId);
  }

  async getProjects(): Promise<Team[]> {
    if (this.linearClient === undefined) throw new LinearIntegrationException('Linear client undefined');
    return (await this.linearClient.teams()).nodes;
  }

  async getMembers(projectId: string): Promise<User[]> {
    const team = await this.getTeam(projectId);
    return (await team.members()).nodes;
  }

  async getStages(team: Team): Promise<WorkflowState[]> {
    return (await team.states()).nodes;
  }

  async getLabels(team: Team): Promise<IssueLabel[]> {
    return (await team.labels()).nodes;
  }

  async getOrganization(): Promise<Organization> {
    if (this.linearClient === undefined) throw new LinearIntegrationException('Linear client undefined');
    return await this.linearClient.organization;
  }

  async getMyMail(): Promise<string> {
    if (this.linearClient === undefined) throw new LinearIntegrationException('Linear client undefined');
    return (await this.linearClient.viewer).email;
  }

  async getIssues(projectId: string): Promise<Issue[]> {
    const team = await this.getTeam(projectId);
    return (
      await team.issues({
        first: 250,
        filter: {
          state: {
            type: { nin: ['completed', 'canceled'] },
          },
        },
      })
    ).nodes;
  }

  async getIssue(issueId: string): Promise<Issue> {
    if (this.linearClient === undefined) throw new LinearIntegrationException('Linear client undefined');
    return await this.linearClient.issue(issueId);
  }

  async getIssueHistory(issue: Issue): Promise<IssueHistory[]> {
    return (await issue.history()).nodes;
  }

  async getIssueData(issue: Issue): Promise<LinearIssueData> {
    const state = await issue.state;
    const creator = await issue.creator;
    const assignee = await issue.assignee;
    const priority = issue.priority;
    const labels = (await issue.labels()).nodes;

    return { assignee, creator, priority, labels, stage: state };
  }

  async getUser(userId: string): Promise<User> {
    if (this.linearClient === undefined) throw new LinearIntegrationException('Linear client undefined');
    return await this.linearClient.user(userId);
  }
}
