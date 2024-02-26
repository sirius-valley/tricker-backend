import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { ConflictException, decryptData, NotFoundException } from '@utils';
import { type IssueLabel, LinearClient, type Organization, type Team, type User, type WorkflowState } from '@linear/sdk';
import process from 'process';
import { type PendingAuthProjectRepository } from '@domains/pendingAuthProject/repository';
import { type PendingAuthProjectDTO } from '@domains/pendingAuthProject/dto';

export class LinearAdapter implements ProjectManagementTool {
  constructor(private readonly pendingAuthProject: PendingAuthProjectRepository) {}

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
}
