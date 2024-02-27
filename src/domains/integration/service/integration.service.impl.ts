import { type IntegrationService } from '@domains/integration/service/integration.service';
import type { ProjectDTO } from '@domains/project/dto';
import { type UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { ConflictException, db, NotFoundException } from '@utils';
import type { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import type { OrganizationDTO } from '@domains/organization/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { RoleRepositoryImpl } from '@domains/role/repository';
import type { RoleDTO } from '@domains/role/dto';
import { UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { StageRepositoryImpl } from '@domains/stage/repository/stage.repository.impl';
import { ProjectStageRepositoryImpl } from '@domains/projectStage/repository';
import type { StageDTO } from '@domains/stage/dto';
import { LabelRepositoryImpl } from '@domains/label/repository';
import { ProjectLabelRepositoryImpl } from '@domains/projectLabel/repository';
import type { LabelDTO } from '@domains/label/dto';
import type { ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import type { PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository';
import type { PendingMemberMailsRepository } from 'domains/pendingMemberMail/repository';
import type { OrganizationRepository } from '@domains/organization/repository';
import { type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectDataDTO, type StageIntegrationInputDTO } from '@domains/integration/dto';

export class IntegrationServiceImpl implements IntegrationService {
  constructor(
    private readonly projectTool: ProjectManagementToolAdapter,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly pendingAuthProjectRepository: PendingProjectAuthorizationRepository,
    private readonly pendingMemberMailsRepository: PendingMemberMailsRepository,
    private readonly organizationRepository: OrganizationRepository
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
    const pendingProject: PendingProjectAuthorizationDTO | null = await this.pendingAuthProjectRepository.getByProjectId(projectId);
    if (pendingProject === null) {
      throw new NotFoundException('PendingAuthProject');
    }
    const memberMails: string[] = (await this.pendingMemberMailsRepository.getByProjectId(projectId)).map((memberMail) => memberMail.email);
    const organization: OrganizationDTO | null = await this.organizationRepository.getByName(pendingProject.organizationId);
    if (organization === null) {
      throw new NotFoundException('Organization');
    }

    const projectData: ProjectDataDTO = await this.projectTool.adaptProjectData({ providerProjectId: projectId, pmEmail: user.email, token: pendingProject.token, memberMails });
    const project: ProjectDTO = await db.$transaction(async (db: Omit<PrismaClient, ITXClientDenyList>): Promise<ProjectDTO> => {
      const projRep: ProjectRepositoryImpl = new ProjectRepositoryImpl(db);
      const newProject: ProjectDTO = await projRep.create(projectData.projectName, projectId, organization.id, projectData.image ?? null);
      await this.integrateMembers({ projectData, projectId: newProject.id, emitterId: user.id, db });
      await this.integrateStages({ projectId: newProject.id, stages: projectData.stages, db });
      await this.integrateLabels({ projectId: newProject.id, labels: projectData.labels, db });

      return newProject;
    });

    return project;
  }

  async integrateMembers(input: MembersIntegrationInputDTO): Promise<void> {
    const roleRepository: RoleRepositoryImpl = new RoleRepositoryImpl(input.db);
    const userRepository: UserRepositoryImpl = new UserRepositoryImpl(input.db);
    const fullyIntegratedUsers = [];
    for (const member of input.projectData.members) {
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
      await userProjectRoleService.create(user.id, input.projectId, user.role, input.emitterId);
    }
  }

  async integrateStages(input: StageIntegrationInputDTO): Promise<void> {
    const stageRepository: StageRepositoryImpl = new StageRepositoryImpl(input.db);
    const projectStageRepository: ProjectStageRepositoryImpl = new ProjectStageRepositoryImpl(input.db);
    for (const name of input.stages) {
      let stage: StageDTO | null = await stageRepository.getByName(name);
      if (stage === null) {
        stage = await stageRepository.create(name);
      }
      await projectStageRepository.create(input.projectId, stage.id);
    }
  }

  async integrateLabels(input: LabelIntegrationInputDTO): Promise<void> {
    const labelRepository: LabelRepositoryImpl = new LabelRepositoryImpl(input.db);
    const projectLabel: ProjectLabelRepositoryImpl = new ProjectLabelRepositoryImpl(input.db);
    for (const name of input.labels) {
      let label: LabelDTO | null = await labelRepository.getByName(name);
      if (label === null) {
        label = await labelRepository.create(name);
      }
      await projectLabel.create(input.projectId, label.id);
    }
  }
}
