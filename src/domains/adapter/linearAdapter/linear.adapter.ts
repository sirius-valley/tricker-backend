import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { ConflictException, decryptData, NotFoundException } from '@utils';
import { type RoleRepository } from '@domains/role/repository';
import { LinearClient, type Organization, type Team, type User } from '@linear/sdk';
import { type RoleDTO } from '@domains/role/dto';
import process from 'process';
import { type PendingAuthProjectRepository } from '@domains/pendingAuthProject/repository';
import { type PendingAuthProjectDTO } from '@domains/pendingAuthProject/dto';

export class LinearAdapter implements ProjectManagementTool {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly pendingAuthProject: PendingAuthProjectRepository
  ) {}

  async integrateProjectData(linearProjectId: string, pmEmail: string): Promise<ProjectDataDTO> {
    const pendingProject: PendingAuthProjectDTO | null = await this.pendingAuthProject.getByProjectId(linearProjectId);
    if (pendingProject === null) {
      throw new NotFoundException('PendingAuthProject');
    }
    const linearClient = new LinearClient({
      apiKey: decryptData(pendingProject.projectToken, process.env.ENCRYPT_SECRET!),
    });
    const team: Team = await linearClient.team(linearProjectId);
    const members: User[] = (await team.members()).nodes.filter((member) => pendingProject.memberMails.find((email) => email === member.email) !== undefined);
    const stages: string[] = (await team.states()).nodes.map((stage) => stage.name);
    const pm: User | undefined = members.find((member) => member.email === pmEmail);
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
    const teamMembers: UserRole[] = members.map((member) => {
      if (pmRole != null && dev != null) {
        role = member.email === pmEmail ? pmRole.id : dev.id;
      }
      return new UserRole({ email: member.email, role });
    });
    const org: Organization = await linearClient.organization;

    return new ProjectDataDTO(linearProjectId, teamMembers, team.name, stages, org.logoUrl ?? null);
  }
}
