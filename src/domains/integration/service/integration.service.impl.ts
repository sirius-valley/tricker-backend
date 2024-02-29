import { type IntegrationService } from '@domains/integration/service/integration.service';
import { type ProjectDTO } from '@domains/project/dto';
import { type UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { ConflictException, db, NotFoundException, UnauthorizedException } from '@utils';
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
import { type LabelIntegrationInputDTO, type MembersIntegrationInputDTO, type ProjectDataDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO, type ProjectsPreIntegratedInputDTO, type StageIntegrationInputDTO, UserRole } from '@domains/integration/dto';
import { type IssueProviderDTO } from '@domains/issueProvider/dto';
import { type IssueProviderRepository } from '@domains/issueProvider/repository';

export class IntegrationServiceImpl implements IntegrationService {
  constructor(
    private readonly adapter: ProjectManagementToolAdapter,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly pendingAuthProjectRepository: PendingProjectAuthorizationRepository,
    private readonly pendingMemberMailsRepository: PendingMemberMailsRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly issueProviderRepository: IssueProviderRepository
  ) {}

  /**
   * Integrate a project into the Linear platform.
   * @param projectId The ID of the project to integrate.
   * @returns The integrated project.
   * @throws {ConflictException} If the project has already been integrated or is inactive.
   * @throws {NotFoundException} If any related entities (organization, pending project) are not found.
   */
  async integrateProject(projectId: string): Promise<ProjectDTO> {
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
    const pendingMemberMails: string[] = (await this.pendingMemberMailsRepository.getByProjectId(pendingProject.id)).map((memberMail) => memberMail.email);
    const organization: OrganizationDTO | null = await this.organizationRepository.getById(pendingProject.organizationId);
    if (organization === null) {
      throw new NotFoundException('Organization');
    }
    const projectData: ProjectDataDTO = await this.adapter.adaptProjectData({ providerProjectId: projectId, pmEmail: user.email, token: pendingProject.token, memberMails: pendingMemberMails });
    const pm: ProjectMemberDataDTO | undefined = projectData.members.find((member): boolean => member.email === user.email);
    if (pm === undefined) {
      throw new ConflictException('Provided Project Manager email not correct.');
    }
    const memberRoles = await this.assignRoles(projectData.members, user.email);
    const project: ProjectDTO = await db.$transaction(async (db: Omit<PrismaClient, ITXClientDenyList>): Promise<ProjectDTO> => {
      const projRep: ProjectRepositoryImpl = new ProjectRepositoryImpl(db);
      const newProject: ProjectDTO = await projRep.create(projectData.projectName, projectId, organization.id, projectData.image ?? null);
      await this.integrateMembers({ memberRoles, projectId: newProject.id, emitterId: user.id, acceptedUsers: pendingMemberMails, db });
      await this.integrateStages({ projectId: newProject.id, stages: projectData.stages, db });
      await this.integrateLabels({ projectId: newProject.id, labels: projectData.labels, db });

      return newProject;
    });

    // await this.pendingAuthProjectRepository.delete(pendingProject.id);

    return project;
  }

  /**
   * Retrieves projects from the specified provider that have not been integrated yet.
   * @param input Includes providerName, apiKey and pmMail
   * @returns {Promise<ProjectPreIntegratedDTO[]>} A promise that resolves with an array of ProjectPreIntegratedDTO objects representing the projects.
   * @throws {NotFoundException} If the specified issue provider is not found.
   */
  async retrieveProjectsFromProvider(input: ProjectsPreIntegratedInputDTO): Promise<ProjectPreIntegratedDTO[]> {
    const provider: IssueProviderDTO | null = await this.issueProviderRepository.getByName(input.providerName);
    if (provider === null) {
      throw new NotFoundException('IssueProvider');
    }
    const pm = await this.userRepository.getByProviderId(input.pmProviderId);
    await this.validateIdentity(input.apyKey, pm?.email);
    const unfilteredProjects: ProjectPreIntegratedDTO[] = await this.adapter.getAndAdaptProjects(input.apyKey);
    const filteredProjects: ProjectPreIntegratedDTO[] = [];
    // retrieve only not integrated projects
    for (const project of unfilteredProjects) {
      const integratedProject: ProjectDTO | null = await this.projectRepository.getByProviderId(project.providerProjectId);
      if (integratedProject === null) {
        filteredProjects.push(project);
      }
    }
    return filteredProjects;
  }

  /**
   * Integrates project members using the provided input data,
   * creates or retrieves users and roles, assigns roles to users,
   * and establishes user-project associations.
   * @param {MembersIntegrationInputDTO} input - Input data including acceptedUsers, memberRoles, project ID, and emitter ID.
   * @returns {Promise<void>} A promise that resolves once the integration is complete.
   * @throws {NotFoundException} If a user or role cannot be found.
   */
  async integrateMembers(input: MembersIntegrationInputDTO): Promise<void> {
    const userRepository: UserRepositoryImpl = new UserRepositoryImpl(input.db);
    const roleRepository: RoleRepositoryImpl = new RoleRepositoryImpl(db);
    const integratedUsers = [];
    for (const member of input.memberRoles) {
      let user: UserDTO | null = await userRepository.getByEmail(member.email);
      let role: RoleDTO | null = await roleRepository.getByName(member.role);
      if (role === null) {
        role = await roleRepository.create(member.role);
      }
      if (user === null) {
        user = await userRepository.createWithoutCognitoId(member.email);
      }
      integratedUsers.push({ ...user, role: role.id });
    }
    const userProjectRoleService: UserProjectRoleServiceImpl = new UserProjectRoleServiceImpl(new UserProjectRoleRepositoryImpl(input.db), userRepository, new ProjectRepositoryImpl(input.db), roleRepository);
    for (const user of integratedUsers) {
      const isAccepted: boolean = input.acceptedUsers.find((email) => email === user.email) !== null;
      await userProjectRoleService.create({
        userId: user.id,
        projectId: input.projectId,
        roleId: user.role,
        userEmitterId: input.emitterId,
        isAccepted,
      });
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

  private async assignRoles(members: ProjectMemberDataDTO[], pmEmail: string): Promise<UserRole[]> {
    return members.map((member: ProjectMemberDataDTO) => {
      const role: string = member.email === pmEmail ? 'Project Manager' : 'Developer';
      return new UserRole({ email: member.email, role });
    });
  }

  /**
   * Validates user identity using an apiKey and an email address.
   * @param {string} apiKey - The API key for authentication.
   * @param {string} pmEmail - The email address of the user to compare.
   * @returns {Promise<void>} - No return value, but throws an exception if validation fails.
   * @throws {UnauthorizedException} - Thrown if the API key is not valid for the provided email.
   */
  async validateIdentity(apiKey: string, pmEmail: string | undefined): Promise<void> {
    try {
      const userEmail = await this.adapter.getMyEmail(apiKey);
      console.log(userEmail);
      console.log(pmEmail);
      if (userEmail !== pmEmail) {
        throw new Error();
      }
    } catch (e) {
      throw new UnauthorizedException('', 'Linear api key is not valid');
    }
  }
}
