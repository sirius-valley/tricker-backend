import { createMockContext, type MockContext } from '@context';
import type { PrismaClient } from '@prisma/client';
import { type EmailService, MailgunEmailService } from '@domains/email/service';
import { mailgunClient } from '@utils/mail';
import { UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from '@domains/pendingMemberMail/repository';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization/repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { ProjectDTO } from '@domains/project/dto';
import { ProjectDataDTO, ProjectMemberDataDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { PendingMemberMailDTO } from '@domains/pendingMemberMail/dto';
import { OrganizationDTO } from '@domains/organization/dto';
import { ConflictException, db, NotFoundException } from '@utils';
import { LinearAdapterMock } from '../../adapter/mockLinearAdapter/linearAdapter.mock';

import { AdministratorRepositoryImpl } from '@domains/administrator/repository/administrator.repository.impl';
import type { AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { type IntegrationRepository } from '@domains/integration/repository/integration.repository';
import { IntegrationRepositoryImpl } from '@domains/integration/repository/integration.repository.impl';

let userMockRepository: UserRepository;
let projectMockRepository: ProjectRepository;
let mockAdapterTool: ProjectManagementToolAdapter;
let pendingAuthProjectMockRepository: PendingProjectAuthorizationRepository;
let pendingMemberMailsMockRepository: PendingMemberMailsRepository;
let organizationMockRepository: OrganizationRepository;
let service: IntegrationService;
let user: UserDTO;
let project: ProjectDTO;
let projectData: ProjectDataDTO;
let pendingProject: PendingProjectAuthorizationDTO;
let pendingMemberMail: PendingMemberMailDTO;
let organization: OrganizationDTO;
let emailSender: EmailService;
let prismaMockCtx: MockContext;
let prismaMock: PrismaClient;
let projectMember: ProjectMemberDataDTO;
let administratorMockRepository: AdministratorRepository;
let integrationRepository: IntegrationRepository;

beforeEach(() => {
  prismaMockCtx = createMockContext();
  prismaMock = prismaMockCtx.prisma;
  emailSender = new MailgunEmailService(mailgunClient);
  userMockRepository = new UserRepositoryImpl(prismaMock);
  mockAdapterTool = new LinearAdapterMock();
  projectMockRepository = new ProjectRepositoryImpl(prismaMock);
  organizationMockRepository = new OrganizationRepositoryImpl(prismaMock);
  pendingMemberMailsMockRepository = new PendingMemberMailsRepositoryImpl(prismaMock);
  pendingAuthProjectMockRepository = new PendingProjectAuthorizationRepositoryImpl(prismaMock);
  administratorMockRepository = new AdministratorRepositoryImpl(prismaMock);
  integrationRepository = new IntegrationRepositoryImpl(prismaMock);

  service = new IntegrationServiceImpl(mockAdapterTool, projectMockRepository, userMockRepository, pendingAuthProjectMockRepository, pendingMemberMailsMockRepository, organizationMockRepository, administratorMockRepository, integrationRepository, emailSender);
  user = new UserDTO({
    id: 'userId',
    profileImage: null,
    cognitoId: 'cognitoId',
    email: 'mail@mail.com',
    name: 'John Doe',
    projectsRoleAssigned: [],
    createdAt: new Date('2023-11-18T19:28:40.065Z'),
    deletedAt: null,
    emittedUserProjectRole: [],
  });
  project = new ProjectDTO({
    id: 'idP',
    providerId: 'pId',
    name: 'Tricker',
    organizationId: 'oId',
    image: 'url',
    createdAt: new Date('2023-11-18T19:28:40.065Z'),
    deletedAt: null,
  });
  projectMember = new ProjectMemberDataDTO({ email: 'mockUser@mock.com', name: 'John Doe', providerId: 'pId' });
  projectData = new ProjectDataDTO('idP', [projectMember], 'Tricker', [], [], null);
  pendingProject = new PendingProjectAuthorizationDTO({
    id: 'ppaId',
    providerProjectId: 'ppId',
    token: 'token',
    issueProviderId: 'ipId',
    integratorId: 'iId',
    organizationId: 'oId',
  });
  pendingMemberMail = new PendingMemberMailDTO({
    id: 'pmmId',
    email: 'mail@mail.com',
    pendingProjectAuthorizationId: 'ppaId',
  });
  organization = new OrganizationDTO({
    id: 'oId',
    name: 'orgName',
  });
});

describe('Integration service', () => {
  describe('Integrate project method tests', () => {
    it('Should successfully integrate a project to tricker', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingMemberMailsMockRepository, 'getByProjectId').mockResolvedValue([{ ...pendingMemberMail, email: 'mail@mail.com' }]);
      jest.spyOn(userMockRepository, 'getByProviderId').mockResolvedValue(user);
      jest.spyOn(organizationMockRepository, 'getById').mockResolvedValue(organization);
      jest.spyOn(mockAdapterTool, 'adaptProjectData').mockResolvedValue({ ...projectData, members: [{ ...projectMember, email: 'mail@mail.com' }] });
      jest.spyOn(db, '$transaction').mockResolvedValue(project);
      jest.spyOn(emailSender, 'sendConfirmationMail').mockResolvedValue();

      const expectedProject: ProjectDTO = project;
      const receivedProject: ProjectDTO = await service.integrateProject('id');

      expect.assertions(2);
      expect(receivedProject.id).toEqual(expectedProject.id);
      expect(receivedProject.createdAt.toISOString()).toEqual(expectedProject.createdAt.toISOString());
    });

    it('Should throw exception when user is null', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingMemberMailsMockRepository, 'getByProjectId').mockResolvedValue([{ ...pendingMemberMail, email: 'mail@mail.com' }]);
      jest.spyOn(userMockRepository, 'getByProviderId').mockResolvedValue(null);

      expect.assertions(2);
      await expect(service.integrateProject('8')).rejects.toThrow(NotFoundException);
      await expect(service.integrateProject('8')).rejects.toThrow("Not found. Couldn't find User");
    });

    it('Should throw exception when project has already been integrated', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(project);

      expect.assertions(2);
      await expect(service.integrateProject('8')).rejects.toThrow(ConflictException);
      await expect(service.integrateProject('8')).rejects.toThrow('Conflict. Project has been already integrated');
    });

    it('Should throw exception when project is inactive', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue({ ...project, deletedAt: new Date('2023-11-18T19:28:40.065Z') });

      expect.assertions(2);
      await expect(service.integrateProject('8')).rejects.toThrow(ConflictException);
      await expect(service.integrateProject('8')).rejects.toThrow('Conflict. Project is currently inactive. Please, re-active it if you need');
    });

    it('Should throw an exception if there is not a pending project with the provided Id', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(null);

      expect.assertions(2);
      await expect(service.integrateProject('8')).rejects.toThrow(NotFoundException);
      await expect(service.integrateProject('8')).rejects.toThrow("Not found. Couldn't find PendingAuthProject");
    });

    it('Should throw an exception if there is not an organization with the provided name', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingMemberMailsMockRepository, 'getByProjectId').mockResolvedValue([{ ...pendingMemberMail, email: 'mail@mail.com' }]);
      jest.spyOn(userMockRepository, 'getByProviderId').mockResolvedValue(user);
      jest.spyOn(organizationMockRepository, 'getById').mockResolvedValue(null);

      expect.assertions(2);
      await expect(service.integrateProject('8')).rejects.toThrow(NotFoundException);
      await expect(service.integrateProject('8')).rejects.toThrow("Not found. Couldn't find Organization");
    });

    it('Should throw an exception if project manager is not included in accepted users', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingMemberMailsMockRepository, 'getByProjectId').mockResolvedValue([pendingMemberMail]);
      jest.spyOn(userMockRepository, 'getByProviderId').mockResolvedValue(user);
      jest.spyOn(organizationMockRepository, 'getById').mockResolvedValue(organization);
      jest.spyOn(mockAdapterTool, 'adaptProjectData').mockResolvedValue(projectData);

      expect.assertions(2);
      await expect(service.integrateProject('8')).rejects.toThrow(ConflictException);
      await expect(service.integrateProject('8')).rejects.toThrow('Conflict. Provided Project Manager email not correct.');
    });
  });

  describe('retrieveProjectsFromProvider method', () => {
    it('should successfully retrieve a projects list', async () => {
      jest.spyOn(userMockRepository, 'getByProviderId').mockResolvedValue(user);
      jest.spyOn(service, 'validateIdentity').mockResolvedValue();
      jest.spyOn(mockAdapterTool, 'getAndAdaptProjects').mockResolvedValue([{ providerProjectId: 'ppID', image: null, name: 'Tricker' }]);
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);

      const expected: ProjectPreIntegratedDTO[] = [{ providerProjectId: 'ppID', image: null, name: 'Tricker' }];
      const received: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ providerName: 'Linear', apyKey: 'mock_secret', pmProviderId: 'mail@mail.com' });

      expect.assertions(2);
      expect(received[0].providerProjectId).toEqual(expected[0].providerProjectId);
      expect(received).toHaveLength(1);
    });
  });
});
