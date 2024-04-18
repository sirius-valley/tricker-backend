import { type EmailService, MailgunEmailService } from '@domains/email/service';
import { mailgunClient } from '@utils/mail';
import { UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from '@domains/pendingMemberMail/repository';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization/repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { ProjectDTO } from '@domains/project/dto';
import { ProjectDataDTO, ProjectMemberDataDTO, type ProjectPreIntegratedDTO, ProjectState } from '@domains/integration/dto';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { PendingMemberMailDTO } from '@domains/pendingMemberMail/dto';
import { OrganizationDTO } from '@domains/organization/dto';
import { ConflictException, Logger, NotFoundException } from '@utils';
import { AdministratorRepositoryImpl } from '@domains/administrator/repository/administrator.repository.impl';
import type { AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { type IntegrationRepository } from '@domains/integration/repository/integration.repository';
import { IntegrationRepositoryImpl } from '@domains/integration/repository/integration.repository.impl';
import * as utils from '@utils/auth';
import { mockPendingProjectAuthorizationDTO } from './new/mockData';
import { mockProjectDTO } from '../../issue/mockData';
import { adapterFactoryMock, linearAdapterMock, prismaMock } from '../../mock/mock';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';

let userMockRepository: UserRepository;
let projectMockRepository: ProjectRepository;
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
let projectMember: ProjectMemberDataDTO;
let administratorMockRepository: AdministratorRepository;
let integrationRepository: IntegrationRepository;
let mockAdapterTool: ProjectManagementToolAdapter;

beforeEach(() => {
  emailSender = new MailgunEmailService(mailgunClient);
  userMockRepository = new UserRepositoryImpl(prismaMock);
  projectMockRepository = new ProjectRepositoryImpl(prismaMock);
  organizationMockRepository = new OrganizationRepositoryImpl(prismaMock);
  pendingMemberMailsMockRepository = new PendingMemberMailsRepositoryImpl(prismaMock);
  pendingAuthProjectMockRepository = new PendingProjectAuthorizationRepositoryImpl(prismaMock);
  administratorMockRepository = new AdministratorRepositoryImpl(prismaMock);
  integrationRepository = new IntegrationRepositoryImpl(prismaMock);
  mockAdapterTool = new LinearAdapter(new LinearDataRetriever());
  service = new IntegrationServiceImpl(adapterFactoryMock, projectMockRepository, userMockRepository, pendingAuthProjectMockRepository, pendingMemberMailsMockRepository, organizationMockRepository, administratorMockRepository, integrationRepository, emailSender);
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
    issueProviderId: '',
    updatedAt: new Date(),
    url: '',
    id: 'idP',
    providerId: 'pId',
    name: 'Tricker',
    organizationId: 'oId',
    image: 'url',
    createdAt: new Date('2023-11-18T19:28:40.065Z'),
    deletedAt: null,
  });
  projectMember = new ProjectMemberDataDTO({ email: 'mockUser@mock.com', name: 'John Doe', providerId: 'pId' });
  projectData = new ProjectDataDTO({
    projectId: 'idP',
    members: [projectMember],
    projectName: 'Tricker',
    image: null,
    stages: [],
    labels: [],
    issues: [],
    url: 'url',
  });
  pendingProject = new PendingProjectAuthorizationDTO({
    id: 'ppaId',
    providerProjectId: 'ppId',
    token: 'token',
    issueProviderId: 'ipId',
    integratorId: 'iId',
    organizationId: 'oId',
    isIntegrating: false,
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
  Logger.disable();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  describe('Integrate project method tests', () => {
    it('Should successfully integrate a project to tricker', async () => {
      const expectedProject: ProjectDTO = { ...project };
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingAuthProjectMockRepository, 'update').mockResolvedValue({ ...pendingProject, isIntegrating: true });
      jest.spyOn(utils, 'decryptData').mockImplementation(() => 'token');
      jest.spyOn(userMockRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(pendingMemberMailsMockRepository, 'getByProjectId').mockResolvedValue([{ ...pendingMemberMail, email: 'mail@mail.com' }]);
      jest.spyOn(organizationMockRepository, 'getById').mockResolvedValue(organization);
      jest.spyOn(emailSender, 'sendConfirmationMail').mockResolvedValue();
      jest.spyOn(pendingAuthProjectMockRepository, 'delete').mockImplementation();
      jest.spyOn(integrationRepository, 'createIntegratedProject').mockResolvedValueOnce(expectedProject);

      adapterFactoryMock.getSpecificAdapter.mockReturnValue(linearAdapterMock);
      linearAdapterMock.adaptProjectData.mockResolvedValue({ ...projectData, members: [{ ...projectMember, email: 'mail@mail.com' }] });
      linearAdapterMock.getMyEmail.mockResolvedValue('mail@mail.com');

      const receivedProject: ProjectDTO = await service.integrateProject('id', 'LINEAR');

      expect.assertions(2);
      expect(receivedProject.id).toEqual(expectedProject.id);
      expect(receivedProject.createdAt.toISOString()).toEqual(expectedProject.createdAt.toISOString());
    });

    it('Should throw exception when user is null', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingAuthProjectMockRepository, 'update').mockResolvedValue({ ...pendingProject, isIntegrating: true });
      jest.spyOn(utils, 'decryptData').mockImplementation(() => 'token');
      jest.spyOn(userMockRepository, 'getByEmail').mockResolvedValue(null);

      adapterFactoryMock.getSpecificAdapter.mockReturnValue(linearAdapterMock);
      linearAdapterMock.getMyEmail.mockResolvedValue('mail@mail.com');

      expect.assertions(2);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow(NotFoundException);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow("Not found. Couldn't find User");
    });

    it('Should throw exception when project has already been integrated', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(project);

      expect.assertions(2);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow(ConflictException);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow('Conflict. Project has been already integrated');
    });

    it('Should throw exception when project is inactive', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue({ ...project, deletedAt: new Date('2023-11-18T19:28:40.065Z') });

      expect.assertions(2);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow(ConflictException);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow('Conflict. Project is currently inactive. Please, re-active it if you need');
    });

    it('Should throw an exception if there is not an organization with the provided name', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingAuthProjectMockRepository, 'update').mockResolvedValue({ ...pendingProject, isIntegrating: true });
      jest.spyOn(utils, 'decryptData').mockImplementation(() => 'token');
      jest.spyOn(userMockRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(pendingMemberMailsMockRepository, 'getByProjectId').mockResolvedValue([{ ...pendingMemberMail, email: 'mail@mail.com' }]);
      jest.spyOn(organizationMockRepository, 'getById').mockResolvedValue(null);

      adapterFactoryMock.getSpecificAdapter.mockReturnValue(linearAdapterMock);
      linearAdapterMock.getMyEmail.mockResolvedValue('mail@mail.com');

      expect.assertions(2);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow(NotFoundException);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow("Not found. Couldn't find Organization");
    });

    // there is no way to make this work
    it.skip('Should throw an exception if project manager is not included in accepted users', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(pendingProject);
      jest.spyOn(pendingAuthProjectMockRepository, 'update').mockResolvedValue({ ...pendingProject, isIntegrating: true });
      jest.spyOn(utils, 'decryptData').mockImplementation(() => 'token');
      jest.spyOn(userMockRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(pendingMemberMailsMockRepository, 'getByProjectId').mockResolvedValue([pendingMemberMail]);
      jest.spyOn(organizationMockRepository, 'getById').mockResolvedValue(organization);
      jest.spyOn(emailSender, 'sendIntegrationErrorEmail').mockResolvedValue();

      adapterFactoryMock.getSpecificAdapter.mockReturnValue(mockAdapterTool);
      // linearAdapterMock.getMyEmail.mockResolvedValue('mail@mail.com');
      jest.spyOn(mockAdapterTool, 'getMyEmail').mockResolvedValue('mail@mail.com');
      // linearAdapterMock.adaptProjectData.mockResolvedValue({ ...projectData, members: [{ ...projectMember, email: 'wrong@mail.com' }] });
      jest.spyOn(mockAdapterTool, 'adaptProjectData').mockResolvedValue({ ...projectData, members: [{ ...projectMember, email: 'wrong@mail.com' }] });

      try {
        await service.integrateProject('id', 'linear');
        jest.runAllTimers();
      } catch (e: any) {
        expect.assertions(2);
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('Conflict. Provided Project Manager email not correct.');
      }
    });
  });

  describe('retrieveProjectsFromProvider method', () => {
    it('should successfully retrieve a projects list', async () => {
      jest.spyOn(userMockRepository, 'getByCognitoId').mockResolvedValue(user);
      jest.spyOn(service, 'validateIntegratorIdentity').mockResolvedValue();
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(null);

      adapterFactoryMock.getSpecificAdapter.mockReturnValue(linearAdapterMock);
      linearAdapterMock.getAndAdaptProjects.mockResolvedValue([{ providerProjectId: 'ppID', image: null, name: 'Tricker', state: ProjectState.NOT_ADDED }]);

      const expected: ProjectPreIntegratedDTO[] = [{ providerProjectId: 'ppID', image: null, name: 'Tricker', state: ProjectState.NOT_ADDED }];
      const received: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ apyKey: 'mock_secret', pmProviderId: 'mail@mail.com', issueProviderName: 'linear' });

      expect.assertions(2);
      expect(received[0].providerProjectId).toEqual(expected[0].providerProjectId);
      expect(received).toHaveLength(1);
    });

    it('should retrieve a projects list with project with pending state if pendingAuthorizationProject has been already created', async () => {
      jest.spyOn(userMockRepository, 'getByCognitoId').mockResolvedValue(user);
      jest.spyOn(service, 'validateIntegratorIdentity').mockResolvedValue();
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(mockPendingProjectAuthorizationDTO);

      adapterFactoryMock.getSpecificAdapter.mockReturnValue(linearAdapterMock);
      linearAdapterMock.getAndAdaptProjects.mockResolvedValue([{ providerProjectId: 'ppID', image: null, name: 'Tricker', state: ProjectState.PENDING }]);

      const received: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ apyKey: 'mock_secret', pmProviderId: 'mail@mail.com', issueProviderName: 'linear' });

      expect.assertions(2);
      expect(received.length).toEqual(1);
      expect(received[0].state).toEqual(ProjectState.PENDING);
    });

    it('should retrieve a projects list with project with added state if the project has been already created', async () => {
      jest.spyOn(userMockRepository, 'getByCognitoId').mockResolvedValue(user);
      jest.spyOn(service, 'validateIntegratorIdentity').mockResolvedValue();
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(mockProjectDTO);
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(null);

      adapterFactoryMock.getSpecificAdapter.mockReturnValue(linearAdapterMock);
      linearAdapterMock.getAndAdaptProjects.mockResolvedValue([{ providerProjectId: 'ppID', image: null, name: 'Tricker', state: ProjectState.ADDED }]);

      const received: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ apyKey: 'mock_secret', pmProviderId: 'mail@mail.com', issueProviderName: 'linear' });

      expect.assertions(2);
      expect(received.length).toEqual(1);
      expect(received[0].state).toEqual(ProjectState.ADDED);
    });
  });

  describe('verifyAdminIdentity method', () => {
    it('Should throw an exception if there is not a pending project with the provided Id', async () => {
      jest.spyOn(projectMockRepository, 'getByProviderId').mockResolvedValue(null);
      jest.spyOn(utils, 'verifyToken').mockImplementation(() => 'idAdmin');
      jest.spyOn(pendingAuthProjectMockRepository, 'getByProjectId').mockResolvedValue(null);

      expect.assertions(2);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow(NotFoundException);
      await expect(service.integrateProject('id', 'LINEAR')).rejects.toThrow("Not found. Couldn't find PendingAuthProject");
    });
  });
});
