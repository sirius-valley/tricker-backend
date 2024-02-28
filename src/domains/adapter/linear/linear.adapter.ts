import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { ProjectDataDTO, UserRole } from '@domains/project/dto';
import { ConflictException } from '@utils';
import { type RoleRepository } from '@domains/role/repository';
import { LinearClient, type Organization, type Team, type TeamConnection, type User, type UserConnection } from '@linear/sdk';
import { type RoleDTO } from '@domains/role/dto';
import process from 'process';
import { ProjectPreIntegratedDTO } from '@domains/integration/dto';

export class LinearAdapter implements ProjectManagementTool {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getProjects(linearKey: string | undefined): Promise<ProjectPreIntegratedDTO[]> {
    const linearClient = new LinearClient({
      apiKey: linearKey,
    });

    const teams: TeamConnection = await linearClient.teams();
    const workspace: Organization = await linearClient.organization;
    return teams.nodes.map((project) => new ProjectPreIntegratedDTO({ providerProjectId: project.id, name: project.name, image: workspace.logoUrl ?? undefined }));
  }

  async integrateProjectData(linearProjectId: string, pmEmail: string): Promise<ProjectDataDTO> {
    const linearClient = new LinearClient({
      apiKey: process.env.LINEAR_SECRET,
    });
    const team: Team = await linearClient.team(linearProjectId);
    const members: UserConnection = await team.members();
    const stages: string[] = (await team.states()).nodes.map((stage) => stage.name);
    const pm: User | undefined = members.nodes.find((member) => member.email === pmEmail);
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
        role = member.email === pmEmail ? pmRole.id : dev.id;
      }
      return new UserRole({ email: member.email, role });
    });
    const org: Organization = await linearClient.organization;

    return new ProjectDataDTO(linearProjectId, teamMembers, team.name, stages, org.logoUrl ?? null);
  }
}
