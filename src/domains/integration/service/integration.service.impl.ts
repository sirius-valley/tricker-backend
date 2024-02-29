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
import { type AuthorizationRequest, type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectDataDTO, type ProjectMemberDataDTO, type StageIntegrationInputDTO } from '@domains/integration/dto';
import { type EmailService } from '@email/email.service';
import { type AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import jwt from 'jsonwebtoken';
import process from 'process';

export class IntegrationServiceImpl implements IntegrationService {
  constructor(
    private readonly projectTool: ProjectManagementToolAdapter,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly pendingAuthProjectRepository: PendingProjectAuthorizationRepository,
    private readonly pendingMemberMailsRepository: PendingMemberMailsRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly administratorRepository: AdministratorRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Integrates a project using the provided project ID and user ID,
   * checks for existing projects and pending authorizations, retrieves project data,
   * and creates a new project with associated members, stages, and labels.
   * @param {string} projectId - The ID of the project to integrate.
   * @param {string} userId - The ID of the user initiating the integration.
   * @returns {Promise<ProjectDTO>} A promise resolving with the integrated project data.
   * @throws {ConflictException} If the project is already integrated or inactive.
   * @throws {NotFoundException} If there is no pending authorization, user, or organization associated with the project.
   */
  async integrateProject(projectId: string, userId: string): Promise<ProjectDTO> {
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
    const user: UserDTO | null = await this.userRepository.getByProviderId(pendingProject.integratorId);
    if (user == null) {
      throw new NotFoundException('User');
    }
    const memberMails: string[] = (await this.pendingMemberMailsRepository.getByProjectId(pendingProject.id)).map((memberMail) => memberMail.email);
    const organization: OrganizationDTO | null = await this.organizationRepository.getById(pendingProject.organizationId);
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

    // await this.pendingAuthProjectRepository.delete(pendingProject.id);

    return project;
  }

  /**
   * Integrates project members using the provided input data,
   * creates or retrieves users and roles, assigns roles to users,
   * and establishes user-project associations.
   * @param {MembersIntegrationInputDTO} input - Input data including project members, project ID, and emitter ID.
   * @returns {Promise<void>} A promise that resolves once the integration is complete.
   * @throws {NotFoundException} If a user or role cannot be found.
   */
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
    const userProjectRoleService: UserProjectRoleServiceImpl = new UserProjectRoleServiceImpl(new UserProjectRoleRepositoryImpl(input.db), userRepository, new ProjectRepositoryImpl(input.db), roleRepository);
    for (const user of fullyIntegratedUsers) {
      await userProjectRoleService.create(user.id, input.projectId, user.role, input.emitterId);
    }
  }

  /**
   * Integrates project stages using the provided input data,
   * creates or retrieves stages, and associates them with the project.
   * @param {StageIntegrationInputDTO} input - Input data including project stages and project ID.
   * @returns {Promise<void>} A promise that resolves once the integration is complete.
   * @throws {NotFoundException} If a stage cannot be found.
   */
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

  /**
   * Integrates project labels using the provided input data,
   * creates or retrieves labels, and associates them with the project.
   * @param {LabelIntegrationInputDTO} input - Input data including project labels and project ID.
   * @returns {Promise<void>} A promise that resolves once the integration is complete.
   * @throws {NotFoundException} If a label cannot be found.
   */
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

  async getMembers(projectId: string): Promise<ProjectMemberDataDTO[]> {
    return await this.projectTool.getMembersByProjectId(projectId);
  }

  async createPendingAuthorization(authReq: AuthorizationRequest): Promise<PendingProjectAuthorizationDTO> {
    const pendingAuth = await this.pendingAuthProjectRepository.create(authReq);
    const admins = await this.administratorRepository.getByName(authReq.organizationName);
    const token = jwt.sign({ projectId: authReq.projectId }, process.env.AUTHORIZATION_SECRET!);

    for (const admin of admins) {
      await this.emailService.sendAuthorizationMail(admin.email, { token });
    }

    return pendingAuth;
  }
}
