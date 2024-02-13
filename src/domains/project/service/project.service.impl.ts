import { type ProjectService } from '@domains/project/service/project.service';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectRepository } from '@domains/project/repository';
import { type UserRepository } from '@domains/user';
import { ConflictException, db, NotFoundException } from '@utils';
import { type ProjectDataDTO, type ProjectDTO } from '@domains/project/dto';
import { type PendingUserRepository } from '@domains/pendingUser/repository';
import { type UserProjectRoleService } from '@domains/userProjectRole/service';

export class ProjectServiceImpl implements ProjectService {
  constructor(
    private readonly projectTool: ProjectManagementTool,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly pendingUserRepository: PendingUserRepository,
    private readonly userProjectRoleService: UserProjectRoleService
  ) {}

  async integrateProject(projectId: string, userId: string): Promise<ProjectDTO> {
    const user = await this.userRepository.getById(userId);
    if (user == null) {
      throw new NotFoundException('User');
    }
    // TO DO: should we add source project id to Project Schema?
    const previousProject = await this.projectRepository.getById(projectId);
    if (previousProject != null) {
      if (previousProject.deletedAt !== null) {
        throw new ConflictException('Project has been already integrated');
      }
      throw new ConflictException('Project is currently inactive. Please, re-active it if you need');
    }

    const projectData: ProjectDataDTO = await this.projectTool.integrateProjectData(projectId, userId);
    const project: ProjectDTO = await db.$transaction(async () => {
      // TO DO: change url prop name to projectImage
      const newProject = await this.projectRepository.create(projectData.projectName, 'url');
      await this.integrateMembers(projectData, newProject.id, userId);

      return newProject;
    });

    return project;
  }

  private async integrateMembers(projectData: ProjectDataDTO, projectId: string, emitterId: string): Promise<void> {
    const fullyIntegratedUsers = [];
    for (const member of projectData.members) {
      // TO DO: see if it is better to use email property in user model or make request to cognito to retrieve identity
      const user = await this.userRepository.getById(member.email);
      if (user == null) {
        await this.pendingUserRepository.create(member.email, projectId);
      } else {
        fullyIntegratedUsers.push({ ...user, role: member.role });
      }
    }
    for (const user of fullyIntegratedUsers) {
      await this.userProjectRoleService.create(user.id, projectId, user.role, emitterId);
    }
  }
}
