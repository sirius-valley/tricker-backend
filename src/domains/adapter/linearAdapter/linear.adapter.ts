import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { ConflictException } from '@utils';
import { type RoleRepository } from '@domains/role/repository';
import { type LinearClient } from '@linear/sdk';

export class LinearAdapter implements ProjectManagementTool {
  // TO DO: Check how to connect with Linear (secret or OAuth)
  constructor(
    private readonly linearClient: LinearClient,
    private readonly roleRepository: RoleRepository
  ) {}

  async integrateProjectData(projectId: string, pmId: string): Promise<ProjectDataDTO> {
    const team = await this.linearClient.team(projectId);
    const members = await team.members();
    const pm = members.nodes.find((member) => member.id === pmId);
    if (pm == null) {
      throw new ConflictException('Provided Project Manager ID not correct.');
    }
    let pmRole = await this.roleRepository.getByName('Project Manager');
    if (pmRole == null) {
      pmRole = await this.roleRepository.create('Project Manager');
    }
    let dev = await this.roleRepository.getByName('Developer');
    if (dev == null) {
      dev = await this.roleRepository.create('Developer');
    }
    let role: string;
    const teamMembers = members.nodes.map((member) => {
      if (pmRole != null && dev != null) {
        role = member.id === pmId ? pmRole.id : dev.id;
      }
      return new UserRole({ email: member.email, role });
    });

    return new ProjectDataDTO(projectId, teamMembers, team.name);
  }
}
