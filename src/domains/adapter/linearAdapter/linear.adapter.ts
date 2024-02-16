import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { ConflictException } from '@utils';
import { type RoleRepository } from '@domains/role/repository';
import { type LinearClient, type Team, type User, type UserConnection } from '@linear/sdk';
import { type RoleDTO } from '@domains/role/dto';

export class LinearAdapter implements ProjectManagementTool {
  // TO DO: Check how to connect with Linear (secret or OAuth)
  constructor(
    private readonly linearClient: LinearClient,
    private readonly roleRepository: RoleRepository
  ) {}

  async integrateProjectData(linearProjectId: string, pmId: string): Promise<ProjectDataDTO> {
    const team: Team = await this.linearClient.team(linearProjectId);
    const members: UserConnection = await team.members();
    const pm: User | undefined = members.nodes.find((member) => member.id === pmId);
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
        role = member.id === pmId ? pmRole.id : dev.id;
      }
      return new UserRole({ email: member.email, role });
    });
    const org = await this.linearClient.organization;

    return new ProjectDataDTO(linearProjectId, teamMembers, team.name, org.logoUrl ?? null);
  }
}
