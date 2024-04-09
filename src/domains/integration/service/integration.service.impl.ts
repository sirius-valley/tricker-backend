import { type IntegrationService } from '@domains/integration/service/integration.service';
import { type BasicProjectDataDTO, type ProjectDTO, ProjectRole } from '@domains/project/dto';
import { type UserData, type UserDTO, type UserRepository } from '@domains/user';
import { ConflictException, decryptData, LinearIntegrationException, Logger, NotFoundException } from '@utils';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type OrganizationDTO } from '@domains/organization/dto';
import { type ProjectRepository } from '@domains/project/repository';
import type { ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import type { PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository';
import type { PendingMemberMailsRepository } from '@domains/pendingMemberMail/repository';
import type { OrganizationRepository } from '@domains/organization/repository';
import { type AuthorizationRequestDTO, type IntegrationParams, type PendingProjectInfoDTO, type ProjectDataDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO, type ProjectsPreIntegratedInputDTO, UserRole } from '@domains/integration/dto';
import { type EmailService } from '@domains/email/service';
import jwt from 'jsonwebtoken';
import { type AuthorizationEmailVariables } from '@domains/email/dto';
import { type AdministratorRepository } from '@domains/administrator/repository';
import { type IntegrationRepository } from '@domains/integration/repository';
import process from 'process';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { retry } from '@utils/retry';
import { type AdministratorDTO } from '@domains/administrator/dto';

export class IntegrationServiceImpl implements IntegrationService {
  constructor(
    private readonly adapter: ProjectManagementToolAdapter,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly pendingAuthProjectRepository: PendingProjectAuthorizationRepository,
    private readonly pendingMemberMailsRepository: PendingMemberMailsRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly administratorRepository: AdministratorRepository,
    private readonly integrationRepository: IntegrationRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Integrate a project into Tricker platform.
   * @param projectId {string} The ID of the project to integrate.
   * @returns {ProjectDTO} The integrated project.
   * @throws {ConflictException} If the project has already been integrated or is inactive.
   * @throws {NotFoundException} If any related entities (organization, pending project) are not found.
   */
  async integrateProject(projectId: string): Promise<ProjectDTO> {
    Logger.time('Verifications');
    // verify if project has not been integrated
    await this.verifyProjectDuplication(projectId);
    const pendingProject: PendingProjectAuthorizationDTO = await this.getPendingProject(projectId);
    await this.pendingAuthProjectRepository.update({ pendingProjectId: pendingProject.id, isIntegrating: true });
    const { email: integratorEmail } = await this.getProjectIntegrator(pendingProject.token);
    const authorizedMemberMails: string[] = await this.getAuthorizedMemberMails(pendingProject.id);
    const { id: organizationId } = await this.getOrganization(pendingProject.organizationId);
    Logger.timeEnd(`Verifications`);

    try {
      const newProject: ProjectDTO = await retry<ProjectDTO, Error>(async () => await this.integration({ projectId, pendingProject, integratorEmail, authorizedMemberMails, organizationId }), { delay: 1000 * 60 * 60 * 2, retries: 3 }, [
        ConflictException,
        PrismaClientKnownRequestError,
        PrismaClientUnknownRequestError,
      ]);
      await this.pendingAuthProjectRepository.delete(pendingProject.id);
      await this.emailService.sendConfirmationMail(integratorEmail, {
        projectName: newProject.name,
        projectId: newProject.id,
        url: process.env.FRONTEND_URL!,
      });
      return newProject;
    } catch (e: any) {
      Logger.error(e.message);
      Logger.error(e.cause);
      Logger.error(e.stack);
      await this.emailService.sendIntegrationErrorEmail(integratorEmail);
      await this.pendingAuthProjectRepository.update({ pendingProjectId: pendingProject.id, isIntegrating: false });
      throw e;
    }
  }

  private async integration({ projectId, pendingProject, organizationId, authorizedMemberMails, integratorEmail }: IntegrationParams): Promise<ProjectDTO> {
    Logger.time('Provider project data adaptation');
    const projectData: ProjectDataDTO = await this.adapter.adaptProjectData({
      providerProjectId: projectId,
      pmEmail: integratorEmail,
      token: pendingProject.token,
    });
    Logger.timeEnd(`Provider project data adaptation`);

    await this.verifyPmExistence(projectData.members, integratorEmail);
    const users: UserRole[] = await this.assignRoles(projectData.members, integratorEmail);

    const newProject: ProjectDTO = await this.integrationRepository.createIntegratedProject({
      authorizedUsers: authorizedMemberMails,
      users,
      project: projectData,
      organizationId,
      integratorEmail,
    });

    Logger.complete(`Integration finished`);

    return newProject;
  }

  private async getAuthorizedMemberMails(pendingProjectId: string): Promise<string[]> {
    const memberEmails = await this.pendingMemberMailsRepository.getByProjectId(pendingProjectId);
    return memberEmails.map((memberMail) => memberMail.email);
  }

  /**
   * Retrieves projects from the specified provider that have not been integrated yet.
   * @param input Includes providerName, apiKey and pmMail
   * @returns {Promise<ProjectPreIntegratedDTO[]>} A promise that resolves with an array of ProjectPreIntegratedDTO objects representing the projects.
   * @throws {NotFoundException} If the specified issue provider is not found.
   */
  async retrieveProjectsFromProvider(input: ProjectsPreIntegratedInputDTO): Promise<ProjectPreIntegratedDTO[]> {
    const pm = await this.userRepository.getByCognitoId(input.pmProviderId);
    await this.validateIntegratorIdentity(input.apyKey, pm?.email);
    const unfilteredProjects: ProjectPreIntegratedDTO[] = await this.adapter.getAndAdaptProjects();
    const filteredProjects: ProjectPreIntegratedDTO[] = [];
    // retrieve only not integrated and not pending authorization projects
    for (const project of unfilteredProjects) {
      const integratedProject: ProjectDTO | null = await this.projectRepository.getByProviderId(project.providerProjectId);
      const pendingAuthorizationProject: PendingProjectAuthorizationDTO | null = await this.pendingAuthProjectRepository.getByProjectId(project.providerProjectId);
      if (integratedProject === null && pendingAuthorizationProject === null) {
        filteredProjects.push(project);
      }
    }
    return filteredProjects;
  }

  private async assignRoles(members: ProjectMemberDataDTO[], pmEmail: string): Promise<UserRole[]> {
    return members.map((member: ProjectMemberDataDTO) => {
      const role: string = member.email === pmEmail ? ProjectRole.PROJECT_MANAGER : ProjectRole.DEVELOPER;
      return new UserRole({ email: member.email, name: member.name, roleName: role });
    });
  }

  /**
   * Validates user identity using an apiKey and an email address.
   * @param {string} apiKey - The API key for authentication.
   * @param {string} pmEmail - The email address of the user to compare.
   * @returns {Promise<void>} - No return value, but throws an exception if validation fails.
   * @throws {UnauthorizedException} - Thrown if the API key is not valid for the provided email.
   */
  async validateIntegratorIdentity(apiKey: string, pmEmail: string | undefined): Promise<void> {
    let userEmail: string;
    try {
      userEmail = await this.adapter.getMyEmail(apiKey);
    } catch (e) {
      throw new LinearIntegrationException(400, 'Linear api key is not valid');
    }
    if (userEmail !== pmEmail) {
      throw new NotFoundException('User');
    }
  }

  /**
   * Gets basic members info that belong to a specific project
   * @param {string} projectId - The Project ID to which members belong
   * @param {string} apiKey - The API key for authentication.
   * @returns {Promise<ProjectMemberDataDTO[]>} A promise that resolves once retrieval is done and contains an array of basic data about project users
   */
  async getMembers(projectId: string, apiKey: string): Promise<ProjectMemberDataDTO[]> {
    return (await this.adapter.getMembersByProjectId(projectId, apiKey)).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Declines a project integration request.
   * @param providerProjectId - The ID of the project in the provider.
   * @returns A Promise that resolves once the project integration request is declined.
   */
  async declineProject(providerProjectId: string): Promise<void> {
    const pendingProject: PendingProjectAuthorizationDTO = await this.getPendingProject(providerProjectId);
    const integrator: UserDTO = await this.getProjectIntegrator(pendingProject.token);
    const project: BasicProjectDataDTO = await this.adapter.getProjectById(providerProjectId, decryptData(pendingProject.token));

    await this.pendingAuthProjectRepository.delete(pendingProject.id);
    await this.emailService.sendDenialMail(integrator.email, { projectName: project.name, projectId: project.id, url: process.env.BACKEND_URL! });
  }

  /**
   * Verifies if there is any duplication of the project based on its provider ID.
   * @param projectProviderId The ID of the project in the provider.
   * @returns A Promise that resolves if there is no duplication of the project.
   * @throws {ConflictException} If a project with the same provider ID is found and is either active or inactive.
   */
  private async verifyProjectDuplication(projectProviderId: string): Promise<void> {
    const previousProject: ProjectDTO | null = await this.projectRepository.getByProviderId(projectProviderId);
    if (previousProject != null) {
      if (previousProject.deletedAt === null) {
        throw new ConflictException('Project has been already integrated');
      }
      throw new ConflictException('Project is currently inactive. Please, re-active it if you need it');
    }
  }

  /**
   * Retrieves a pending project for authorization based on its provider ID.
   * @param projectProviderId The ID of the project provider.
   * @returns A promise that resolves with the found pending project.
   * @throws {NotFoundException} If no pending project is found with the provided ID.
   */
  private async getPendingProject(projectProviderId: string): Promise<PendingProjectAuthorizationDTO> {
    const pendingProject = await this.pendingAuthProjectRepository.getByProjectId(projectProviderId);
    if (pendingProject === null) {
      throw new NotFoundException('PendingAuthProject');
    }
    return pendingProject;
  }

  /**
   * Retrieves the integrator of the project using the provided API key.
   * @param apikey The API key used for authentication.
   * @returns A promise that resolves with the user who is the integrator of the project.
   * @throws {NotFoundException} If the user is not found.
   */
  private async getProjectIntegrator(apikey: string): Promise<UserDTO> {
    const userEmail: string = await this.adapter.getMyEmail(decryptData(apikey));
    const user: UserDTO | null = await this.userRepository.getByEmail(userEmail);
    if (user == null) {
      throw new NotFoundException('User');
    }
    return user;
  }

  private async getOrganization(orgId: string): Promise<OrganizationDTO> {
    const organization = await this.organizationRepository.getById(orgId);
    if (organization === null) {
      throw new NotFoundException('Organization');
    }

    return organization;
  }

  private async verifyPmExistence(members: ProjectMemberDataDTO[], pmEmail: string): Promise<void> {
    const pm: ProjectMemberDataDTO | undefined = members.find((member): boolean => member.email === pmEmail);
    if (pm === undefined) {
      throw new ConflictException('Provided Project Manager email not correct.');
    }
  }

  /**
   * Creates a pending project authorization for later admin approval
   * @param {AuthorizationRequestDTO} authReq - Already validated input data to create the pending authorization
   * @returns {Promise<PendingProjectAuthorizationDTO>} A promise that resolves once emails are sent and authorization was created, containing info about the latter
   */
  async createPendingAuthorization(authReq: AuthorizationRequestDTO): Promise<{ pendingProject: PendingProjectAuthorizationDTO; pmIsAdmin: boolean }> {
    const existingPendingAuth = await this.pendingAuthProjectRepository.getByProjectId(authReq.projectId);
    if (existingPendingAuth != null) {
      throw new ConflictException('The project you are trying to integrate is already waiting for authorization.');
    }
    await this.verifyProjectDuplication(authReq.projectId);

    const integrator: UserData = await this.adapter.getMemberById(authReq.integratorId, authReq.apiToken);
    const project: BasicProjectDataDTO = await this.adapter.getProjectById(authReq.projectId, authReq.apiToken);
    const admins: AdministratorDTO[] = await this.administratorRepository.getByOrganizationName(authReq.organizationName);
    if (admins.length === 0) {
      throw new ConflictException('Your organization has not any Administrator registered in tricker. Please contact your Organization.');
    }
    const pendingAuth: PendingProjectAuthorizationDTO = await this.integrationRepository.createIntegrationProjectRequest(authReq);
    const adminIntegrator: AdministratorDTO | undefined = admins.find((admin) => admin.email === integrator.email);
    const pmIsAdmin: boolean = adminIntegrator !== undefined;
    if (!pmIsAdmin) {
      for (const admin of admins) {
        const token = jwt.sign({ adminId: admin.id }, process.env.AUTHORIZATION_SECRET!, { expiresIn: '7 days' });
        const variables: AuthorizationEmailVariables = this.createEmailVariables(token, project, integrator);
        await this.emailService.sendAuthorizationMail(admin.email, variables);
      }
    }

    return { pendingProject: pendingAuth, pmIsAdmin };
  }

  /**
   * Method that encapsulates logic for creating the email variables that will be used to send the email
   * */
  private createEmailVariables(token: string, project: BasicProjectDataDTO, integrator: UserData): AuthorizationEmailVariables {
    return {
      acceptanceToken: token,
      denialToken: token,
      projectName: project.name,
      projectId1: project.id,
      projectId2: project.id,
      integratorName: integrator.name,
      acceptanceUrl: process.env.FRONTEND_URL!,
      denialUrl: process.env.FRONTEND_URL!,
    };
  }

  /**
   * Accepts a project.
   * @param projectId The unique identifier of the project.
   * @returns A Promise that resolves when the project is accepted.
   * @throws {ConflictException} If the project integration flow is currently in progress.
   */
  async acceptProject(projectId: string): Promise<void> {
    const pendingProject: PendingProjectAuthorizationDTO = await this.getPendingProject(projectId);
    if (pendingProject.isIntegrating) {
      throw new ConflictException('Project already being integrated');
    }
    const apiKey: string = decryptData(pendingProject.token);
    const project: BasicProjectDataDTO = await this.adapter.getProjectById(projectId, apiKey);
    const email: string = await this.adapter.getMyEmail(apiKey);

    await this.emailService.sendAcceptanceMail(email, { projectName: project.name });
  }

  async provideProjectInfo(projectId: string): Promise<PendingProjectInfoDTO> {
    const pendingProject: PendingProjectAuthorizationDTO = await this.getPendingProject(projectId);
    const pm: UserData = await this.adapter.getMemberById(pendingProject.integratorId, decryptData(pendingProject.token));
    const projectFromLinear: BasicProjectDataDTO = await this.adapter.getProjectById(projectId, decryptData(pendingProject.token));

    return { pmImage: pm.image, pmName: pm.name, projectImage: projectFromLinear.projectImage ?? null, projectName: projectFromLinear.name };
  }
}
