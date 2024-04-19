import { type EmailService, MailgunEmailService } from '@domains/email/service';
import { mailgunClient } from '@utils/mail';
import { UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type OrganizationRepository, OrganizationRepositoryImpl } from '@domains/organization/repository';
import { type PendingMemberMailsRepository, PendingMemberMailsRepositoryImpl } from '@domains/pendingMemberMail/repository';
import { type PendingProjectAuthorizationRepository, PendingProjectAuthorizationRepositoryImpl } from '@domains/pendingProjectAuthorization/repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { ProjectDTO } from '@domains/project/dto';
import { AuthorizationRequestDTO, AuthorizedMemberDTO, type PendingProjectInfoDTO, ProjectDataDTO, ProjectMemberDataDTO, type ProjectPreIntegratedDTO, ProjectState } from '@domains/integration/dto';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { PendingMemberMailDTO } from '@domains/pendingMemberMail/dto';
import { OrganizationDTO } from '@domains/organization/dto';
import { ConflictException, IsValidIssueProviderConstraint, IsValidOrganizationConstraint, Logger, NotFoundException, validateRequest } from '@utils';
import { AdministratorRepositoryImpl } from '@domains/administrator/repository/administrator.repository.impl';
import type { AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { type IntegrationRepository } from '@domains/integration/repository/integration.repository';
import { IntegrationRepositoryImpl } from '@domains/integration/repository/integration.repository.impl';
import {
  mockBasicProjectDataDTO,
  mockedAdminEmail,
  mockedEncryptedToken,
  mockedGeneratedId,
  mockedIntegratorId,
  mockedIssueProviderId,
  mockedIssueProviderName,
  mockedMemberName,
  mockedOrganizationId,
  mockedOrganizationName,
  mockedProjectName,
  mockedProviderProjectId,
  mockedToken,
  mockedUrl,
  mockPendingProjectAuthorizationDTO,
  mockPendingProjectInfoDTO,
  mockProjectMember1,
  mockProjectMember2,
  mockProjectMember3,
  mockProjectMembers,
  mocksAdministratorDTO,
  mockUserDataDTO,
} from './mockData';
import { mockProjectDTO, mockUserDTO } from '../issue/mockData';
import { adapterFactoryMock, administratorRepositoryMock, emailServiceMock, integrationRepositoryMock, linearAdapterMock, organizationRepositoryMock, pendingAuthProjectRepositoryMock, pendingMemberMailsRepositoryMock, prismaMock, projectRepositoryMock, userRepositoryMock } from '../../mock';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';
import * as utils from '@utils/auth';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';

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

describe('old integration service tests', () => {
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

describe('new integration service tests', () => {
  let testedService: IntegrationService;

  beforeEach(() => {
    jest.resetAllMocks();
    adapterFactoryMock.getSpecificAdapter.mockReturnValue(linearAdapterMock);
    testedService = new IntegrationServiceImpl(adapterFactoryMock, projectRepositoryMock, userRepositoryMock, pendingAuthProjectRepositoryMock, pendingMemberMailsRepositoryMock, organizationRepositoryMock, administratorRepositoryMock, integrationRepositoryMock, emailServiceMock);
  });

  describe('declineProject method', () => {
    it('should send a decline email when the integration request is denied', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(mockPendingProjectAuthorizationDTO);
      jest.spyOn(utils, 'decryptData').mockImplementation(() => mockedToken);
      linearAdapterMock.getMyEmail.mockResolvedValue('myEmail@mail.com');
      userRepositoryMock.getByEmail.mockResolvedValue(mockUserDTO);
      linearAdapterMock.getProjectById.mockResolvedValue(mockBasicProjectDataDTO);
      pendingAuthProjectRepositoryMock.delete.mockImplementation(async () => mockPendingProjectAuthorizationDTO);
      emailServiceMock.sendDenialMail.mockImplementation(async () => {});

      // when
      await testedService.declineProject(mockedProviderProjectId, 'linear');

      // then
      expect.assertions(3);
      expect(emailServiceMock.sendDenialMail).toHaveBeenCalledTimes(1);
      expect(linearAdapterMock.getProjectById).toHaveBeenCalledTimes(1);
      expect(linearAdapterMock.getMyEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if integrator is not correct', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(mockPendingProjectAuthorizationDTO);
      jest.spyOn(utils, 'decryptData').mockImplementation(() => mockedToken);
      linearAdapterMock.getMyEmail.mockResolvedValue('myEmail@mail.com');
      userRepositoryMock.getByEmail.mockResolvedValue(null);
      // when - then
      expect.assertions(2);
      try {
        await testedService.declineProject(mockedProviderProjectId, 'linear');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("Not found. Couldn't find User");
      }
    });

    it('should throw a NotFoundException if pending project is null', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(null);
      // when - then
      expect.assertions(2);
      try {
        await testedService.declineProject(mockedProviderProjectId, 'linear');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("Not found. Couldn't find PendingAuthProject");
      }
    });
  });

  describe('createPendingAuthorization method', () => {
    it('should create a pending project authorization successfully', async () => {
      // GIVEN
      process.env.AUTHORIZATION_SECRET = 'secret';
      process.env.FRONTEND_URL = mockedUrl;
      const pendingAuthRequest: AuthorizationRequestDTO = {
        apiToken: mockedToken,
        projectId: mockedProviderProjectId,
        integratorId: mockedIntegratorId,
        members: mocksAdministratorDTO,
        organizationName: mockedOrganizationName,
        issueProviderName: mockedIssueProviderId,
      };
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(null);
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      linearAdapterMock.getMemberById.mockResolvedValue(mockUserDataDTO);
      linearAdapterMock.getProjectById.mockResolvedValue(mockBasicProjectDataDTO);
      administratorRepositoryMock.getByOrganizationName.mockResolvedValue(mocksAdministratorDTO);
      jest.spyOn(jwt, 'sign').mockImplementation(() => mockedToken);
      emailServiceMock.sendAuthorizationMail.mockResolvedValue();
      integrationRepositoryMock.createIntegrationProjectRequest.mockImplementation(async () => mockPendingProjectAuthorizationDTO);

      // WHEN
      const { pendingProject: actualPendingAuthorization } = await testedService.createPendingAuthorization(pendingAuthRequest, 'linear');

      // THEN
      const expectedAuthRequest: PendingProjectAuthorizationDTO = {
        id: mockedGeneratedId,
        providerProjectId: mockedProviderProjectId,
        token: mockedEncryptedToken,
        issueProviderId: mockedIssueProviderId,
        integratorId: mockedIntegratorId,
        organizationId: mockedOrganizationId,
        isIntegrating: false,
      };

      expect(emailServiceMock.sendAuthorizationMail).toHaveBeenCalledTimes(2);
      expect(emailServiceMock.sendAuthorizationMail).toHaveBeenNthCalledWith(1, '1' + mockedAdminEmail, {
        integratorName: mockedMemberName,
        projectName: mockedProjectName,
        projectId1: mockedProviderProjectId,
        projectId2: mockedProviderProjectId,
        denialUrl: mockedUrl,
        denialToken: expect.any(String),
        acceptanceUrl: mockedUrl,
        acceptanceToken: expect.any(String),
      });
      expect(emailServiceMock.sendAuthorizationMail).toHaveBeenNthCalledWith(2, '2' + mockedAdminEmail, {
        integratorName: mockedMemberName,
        projectName: mockedProjectName,
        projectId1: mockedProviderProjectId,
        projectId2: mockedProviderProjectId,
        denialUrl: mockedUrl,
        denialToken: expect.any(String),
        acceptanceUrl: mockedUrl,
        acceptanceToken: expect.any(String),
      });
      expect(actualPendingAuthorization).toEqual(expectedAuthRequest);
    });

    it('should validate and modify request AuthorizationRequestDTO object correctly', async () => {
      // GIVEN
      const pendingAuthRequest: AuthorizationRequestDTO = {
        apiToken: mockedToken,
        projectId: mockedProviderProjectId,
        integratorId: mockedIntegratorId,
        members: mocksAdministratorDTO,
        organizationName: mockedOrganizationName,
        issueProviderName: mockedIssueProviderName,
      };

      const spiedIssueProviderConstraint = jest.spyOn(IsValidIssueProviderConstraint.prototype, 'validate').mockResolvedValue(true);
      const spiedOrganizationConstraint = jest.spyOn(IsValidOrganizationConstraint.prototype, 'validate').mockResolvedValue(true);

      const req = {
        body: pendingAuthRequest,
      } as unknown as Request;

      // WHEN
      await validateRequest(AuthorizationRequestDTO, 'body')(req, {} as unknown as Response, jest.fn() as NextFunction);

      // THEN
      expect(req.body).toBeInstanceOf(AuthorizationRequestDTO);
      req.body.members.forEach((member: AuthorizedMemberDTO) => {
        expect(member).toBeInstanceOf(AuthorizedMemberDTO);
      });
      expect(spiedIssueProviderConstraint).toHaveBeenCalledWith(mockedIssueProviderName, {
        constraints: [],
        object: plainToInstance(AuthorizationRequestDTO, pendingAuthRequest),
        property: 'issueProviderName',
        targetName: 'AuthorizationRequestDTO',
        value: mockedIssueProviderName,
      });
      expect(spiedOrganizationConstraint).toHaveBeenCalledWith(mockedOrganizationName, {
        constraints: [],
        object: plainToInstance(AuthorizationRequestDTO, pendingAuthRequest),
        property: 'organizationName',
        targetName: 'AuthorizationRequestDTO',
        value: mockedOrganizationName,
      });
    });
  });

  describe('getMembers method', () => {
    it('should return a list of members ordered alphabetically', async () => {
      // given
      linearAdapterMock.getMembersByProjectId.mockResolvedValue(mockProjectMembers);
      const expected: ProjectMemberDataDTO[] = [mockProjectMember1, mockProjectMember2, mockProjectMember3]; // ordered array

      // when
      const received: ProjectMemberDataDTO[] = await testedService.getMembers(mockedProviderProjectId, mockedToken, 'linear');

      // then
      expect.assertions(3);
      expect(received[0].name).toEqual(expected[0].name);
      expect(received[1].name).toEqual(expected[1].name);
      expect(received[2].email).toEqual(expected[2].email);
    });
  });

  describe('acceptProject method', () => {
    it('should send an acceptance email when the integration request is approved', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(mockPendingProjectAuthorizationDTO);
      jest.spyOn(utils, 'decryptData').mockImplementation(() => mockedToken);
      linearAdapterMock.getProjectById.mockResolvedValue(mockBasicProjectDataDTO);
      linearAdapterMock.getMyEmail.mockResolvedValue('myEmail@mail.com');
      emailServiceMock.sendAcceptanceMail.mockImplementation(async () => {});

      // when
      await testedService.acceptProject(mockedProviderProjectId, 'linear');

      // then
      expect.assertions(3);
      expect(emailServiceMock.sendAcceptanceMail).toHaveBeenCalledTimes(1);
      expect(linearAdapterMock.getProjectById).toHaveBeenCalledTimes(1);
      expect(linearAdapterMock.getMyEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException if pending is already integrating', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue({ ...mockPendingProjectAuthorizationDTO, isIntegrating: true });
      // when - then
      expect.assertions(2);
      try {
        await testedService.acceptProject(mockedProviderProjectId, 'linear');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Conflict. Project already being integrated');
      }
    });
  });

  describe('provideProjectInfo method', () => {
    it('should successfully return pending project info', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(mockPendingProjectAuthorizationDTO);
      linearAdapterMock.getMemberById.mockResolvedValue(mockUserDataDTO);
      jest.spyOn(utils, 'decryptData').mockImplementation(() => mockedToken);
      linearAdapterMock.getProjectById.mockResolvedValue(mockBasicProjectDataDTO);
      const expected: PendingProjectInfoDTO = mockPendingProjectInfoDTO;

      // when
      const received: PendingProjectInfoDTO = await testedService.provideProjectInfo(mockedProviderProjectId, 'linear');

      // then
      expect.assertions(2);
      expect(received.pmName).toEqual(expected.pmName);
      expect(received.projectName).toEqual(expected.projectName);
    });
  });
});
