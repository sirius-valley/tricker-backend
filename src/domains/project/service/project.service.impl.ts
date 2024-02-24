import { type ProjectService } from '@domains/project/service/project.service';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { ConflictException, db, NotFoundException } from '@utils';
import { type ProjectDataDTO, type ProjectDTO } from '@domains/project/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { type RoleRepository, RoleRepositoryImpl } from '@domains/role/repository';
import { UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { PendingUserRepositoryImpl } from '@domains/pendingUser/repository';
import { UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { StageServiceImpl } from '@domains/stage/service';
import { StageRepositoryImpl } from '@domains/stage/repository/stage.repository.impl';
import { ProjectStageRepositoryImpl } from '@domains/projectStage/repository';
import type { RoleDTO } from '@domains/role/dto';

export class ProjectServiceImpl implements ProjectService {
  constructor(
    private readonly projectTool: ProjectManagementTool,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async integrateProject(projectId: string, userId: string): Promise<ProjectDTO> {
    const user: UserDTO | null = await this.userRepository.getByProviderId(userId);
    if (user == null) {
      throw new NotFoundException('User');
    }
    const previousProject: ProjectDTO | null = await this.projectRepository.getByProviderId(projectId);
    if (previousProject != null) {
      if (previousProject.deletedAt === null) {
        throw new ConflictException('Project has been already integrated');
      }
      throw new ConflictException('Project is currently inactive. Please, re-active it if you need');
    }

    const projectData: ProjectDataDTO = await this.projectTool.integrateProjectData(projectId, user.email);
    const project: ProjectDTO = await db.$transaction(async (db: Omit<PrismaClient, ITXClientDenyList>): Promise<ProjectDTO> => {
      const projRep: ProjectRepositoryImpl = new ProjectRepositoryImpl(db);
      const newProject: ProjectDTO = await projRep.create(projectData.projectName, projectId, projectData.image ?? null);
      await this.integrateMembers(projectData, newProject.id, user.id, db);
      await this.integrateStages(newProject.id, projectData.stages, db);
      // await this.integrateLabels(newProject.id, projectData.labels, db);

      return newProject;
    });

    return project;
  }

  private async integrateMembers(projectData: ProjectDataDTO, projectId: string, emitterId: string, db: Omit<PrismaClient, ITXClientDenyList>): Promise<void> {
    const fullyIntegratedUsers = [];
    const pendingUserRepository: PendingUserRepositoryImpl = new PendingUserRepositoryImpl(db);
    for (const member of projectData.members) {
      const user: UserDTO | null = await this.userRepository.getByEmail(member.email);
      let role: RoleDTO | null = await this.roleRepository.getByName(member.role);
      if (role === null) {
        role = await this.roleRepository.create(member.role);
      }
      if (user === null) {
        await pendingUserRepository.create(member.email, projectId);
      } else {
        fullyIntegratedUsers.push({ ...user, role: role.id });
      }
    }
    const userProjectRoleService: UserProjectRoleServiceImpl = new UserProjectRoleServiceImpl(new UserProjectRoleRepositoryImpl(db), new UserRepositoryImpl(db), new ProjectRepositoryImpl(db), new RoleRepositoryImpl(db));
    for (const user of fullyIntegratedUsers) {
      await userProjectRoleService.create(user.id, projectId, user.role, emitterId);
    }
  }

  private async integrateStages(projectId: string, stages: string[], db: Omit<PrismaClient, ITXClientDenyList>): Promise<void> {
    const stageService: StageServiceImpl = new StageServiceImpl(new StageRepositoryImpl(db));
    const projectStageRepository: ProjectStageRepositoryImpl = new ProjectStageRepositoryImpl(db);
    for (const stage of stages) {
      const stageId: string = (await stageService.getOrCreate(stage)).id;
      await projectStageRepository.create(projectId, stageId);
    }
  }
}
