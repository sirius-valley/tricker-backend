import { type ProjectService } from '@domains/project/service/project.service';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { ConflictException, db, NotFoundException } from '@utils';
import { type ProjectDataDTO, type ProjectDTO } from '@domains/project/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { RoleRepositoryImpl } from '@domains/role/repository';
import { UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { StageRepositoryImpl } from '@domains/stage/repository/stage.repository.impl';
import { ProjectStageRepositoryImpl } from '@domains/projectStage/repository';
import type { RoleDTO } from '@domains/role/dto';
import { LabelRepositoryImpl } from '@domains/label/repository';
import { ProjectLabelRepositoryImpl } from '@domains/projectLabel/repository';
import { type LabelDTO } from '@domains/label/dto';
import { type StageDTO } from '@domains/stage/dto';

export class ProjectServiceImpl implements ProjectService {
  constructor(
    private readonly projectTool: ProjectManagementTool,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository
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
      await this.integrateLabels(newProject.id, projectData.labels, db);

      return newProject;
    });

    return project;
  }

  private async integrateMembers(projectData: ProjectDataDTO, projectId: string, emitterId: string, db: Omit<PrismaClient, ITXClientDenyList>): Promise<void> {
    const roleRepository: RoleRepositoryImpl = new RoleRepositoryImpl(db);
    const userRepository: UserRepositoryImpl = new UserRepositoryImpl(db);
    const fullyIntegratedUsers = [];
    for (const member of projectData.members) {
      const user: UserDTO | null = await userRepository.getByEmail(member.email);
      let role: RoleDTO | null = await roleRepository.getByName(member.role);
      if (role === null) {
        role = await roleRepository.create(member.role);
      }
      if (user === null) {
        await userRepository.createWithoutCognitoId(member.email);
      } else {
        fullyIntegratedUsers.push({ ...user, role: role.id });
      }
    }
    const userProjectRoleService: UserProjectRoleServiceImpl = new UserProjectRoleServiceImpl(new UserProjectRoleRepositoryImpl(db), userRepository, new ProjectRepositoryImpl(db), roleRepository);
    for (const user of fullyIntegratedUsers) {
      await userProjectRoleService.create(user.id, projectId, user.role, emitterId);
    }
  }

  private async integrateStages(projectId: string, stages: string[], db: Omit<PrismaClient, ITXClientDenyList>): Promise<void> {
    const stageRepository: StageRepositoryImpl = new StageRepositoryImpl(db);
    const projectStageRepository: ProjectStageRepositoryImpl = new ProjectStageRepositoryImpl(db);
    for (const name of stages) {
      let stage: StageDTO | null = await stageRepository.getByName(name);
      if (stage === null) {
        stage = await stageRepository.create(name);
      }
      await projectStageRepository.create(projectId, stage.id);
    }
  }

  private async integrateLabels(projectId: string, labels: string[], db: Omit<PrismaClient, ITXClientDenyList>): Promise<void> {
    const labelRepository: LabelRepositoryImpl = new LabelRepositoryImpl(db);
    const projectLabel: ProjectLabelRepositoryImpl = new ProjectLabelRepositoryImpl(db);
    for (const name of labels) {
      let label: LabelDTO | null = await labelRepository.getByName(name);
      if (label === null) {
        label = await labelRepository.create(name);
      }
      await projectLabel.create(projectId, label.id);
    }
  }
}
