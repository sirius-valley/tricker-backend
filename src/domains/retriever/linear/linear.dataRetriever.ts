import { type LinearClient } from '@linear/sdk';

export class LinearDataRetriever {
  private readonly linearClient: LinearClient | undefined;
  private apiKey: string | undefined;

  setKey(apiKey: string): void {
    if (this.linearClient !== undefined) return;
    this.apiKey = apiKey;
    // this.linearClient = this.initializeLinearClient();
  }
}
/*
const key: string = decryptData(input.token, process.env.ENCRYPT_SECRET!);
this.setKey(key);
if (this.linearClient === undefined) {
    throw new LinearIntegrationException('Linear Client not created');
}
const team: Team = await this.linearClient.team(input.providerProjectId);
const members: User[] = (await team.members()).nodes.map((member) => member);
const stages: string[] = await this.getStages(team);
const teamMembers: ProjectMemberDataDTO[] = members.map((member) => new ProjectMemberDataDTO({ providerId: member.id, email: member.email, name: member.name }));
const labels: string[] = await this.getLabels(team);
const org: Organization = await this.linearClient.organization;

return new ProjectDataDTO(input.providerProjectId, teamMembers, team.name, stages, labels, org.logoUrl ?? null);
 */
