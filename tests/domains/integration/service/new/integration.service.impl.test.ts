import { mock, type MockProxy } from 'jest-mock-extended';
import type { IntegrationRepository } from '@domains/integration/repository/integration.repository';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { type EmailService } from '@domains/email/service';
import { type AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { type OrganizationRepository } from '@domains/organization/repository';
import { type PendingMemberMailsRepository } from '@domains/pendingMemberMail/repository';
import { type UserRepository } from '@domains/user';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type ProjectRepository } from '@domains/project/repository';
import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository';
import {
  mockBasicProjectDataDTO,
  mockedAdminEmail,
  mockedIntegratorId,
  mockedIssueProviderId,
  mockedMemberName,
  mockedOrganizationId,
  mockedProjectName,
  mockedProviderProjectId,
  mockedEncryptedToken,
  mockPendingProjectAuthorizationDTO,
  mocksAdministratorDTO,
  mockUserDataDTO,
  mockedToken,
  mockedGeneratedId,
  mockedIssueProviderName,
  mockedOrganizationName,
  mockedUrl,
  mockProjectMembers,
  mockProjectMember1,
  mockProjectMember3,
  mockProjectMember2,
} from './mockData';
import { AuthorizationRequestDTO, AuthorizedMemberDTO, type ProjectMemberDataDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type NextFunction, type Request, type Response } from 'express';
import { IsValidIssueProviderConstraint, IsValidOrganizationConstraint, NotFoundException, validateRequest } from '@utils';
import { plainToInstance } from 'class-transformer';
import * as auth from '@utils/auth';
import { mockUserDTO } from '../../../issue/mockData';

describe('integration service tests', () => {
  const adapterMock: MockProxy<ProjectManagementToolAdapter> = mock<ProjectManagementToolAdapter>();
  const projectRepositoryMock: MockProxy<ProjectRepository> = mock<ProjectRepository>();
  const userRepositoryMock: MockProxy<UserRepository> = mock<UserRepository>();
  const pendingAuthProjectRepositoryMock: MockProxy<PendingProjectAuthorizationRepository> = mock<PendingProjectAuthorizationRepository>();
  const pendingMemberMailsRepositoryMock: MockProxy<PendingMemberMailsRepository> = mock<PendingMemberMailsRepository>();
  const organizationRepositoryMock: MockProxy<OrganizationRepository> = mock<OrganizationRepository>();
  // const issueProviderRepositoryMock: MockProxy<IssueProviderRepository> = mock<IssueProviderRepository>();
  const administratorRepositoryMock: MockProxy<AdministratorRepository> = mock<AdministratorRepository>();
  const integrationRepositoryMock: MockProxy<IntegrationRepository> = mock<IntegrationRepository>();
  const emailServiceMock: MockProxy<EmailService> = mock<EmailService>();
  let testedService: IntegrationService;

  beforeEach(() => {
    jest.resetAllMocks();
    testedService = new IntegrationServiceImpl(adapterMock, projectRepositoryMock, userRepositoryMock, pendingAuthProjectRepositoryMock, pendingMemberMailsRepositoryMock, organizationRepositoryMock, administratorRepositoryMock, integrationRepositoryMock, emailServiceMock);
  });

  describe('declineProject method', () => {
    it('should send a decline email when the integration request is denied', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(mockPendingProjectAuthorizationDTO);
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockedToken);
      adapterMock.getMyEmail.mockResolvedValue('myEmail@mail.com');
      userRepositoryMock.getByEmail.mockResolvedValue(mockUserDTO);
      adapterMock.getProjectById.mockResolvedValue(mockBasicProjectDataDTO);
      pendingAuthProjectRepositoryMock.delete.mockImplementation(async () => mockPendingProjectAuthorizationDTO);
      emailServiceMock.sendDenialMail.mockImplementation(async () => {});

      // when
      await testedService.declineProject(mockedProviderProjectId);

      // then
      expect.assertions(3);
      expect(emailServiceMock.sendDenialMail).toHaveBeenCalledTimes(1);
      expect(adapterMock.getProjectById).toHaveBeenCalledTimes(1);
      expect(adapterMock.getMyEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if integrator is not correct', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(mockPendingProjectAuthorizationDTO);
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockedToken);
      adapterMock.getMyEmail.mockResolvedValue('myEmail@mail.com');
      userRepositoryMock.getByEmail.mockResolvedValue(null);
      // when - then
      expect.assertions(2);
      await expect(testedService.declineProject(mockedProviderProjectId)).rejects.toThrow(NotFoundException);
      await expect(testedService.declineProject(mockedProviderProjectId)).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw a NotFoundException if pending project is null', async () => {
      // given
      pendingAuthProjectRepositoryMock.getByProjectId.mockResolvedValue(null);
      // when - then
      expect.assertions(2);
      await expect(testedService.declineProject(mockedProviderProjectId)).rejects.toThrow(NotFoundException);
      await expect(testedService.declineProject(mockedProviderProjectId)).rejects.toThrow("Not found. Couldn't find PendingAuthProject");
    });
  });

  describe('createPendingAuthorization method', () => {
    it('should create a pending project authorization successfully', async () => {
      // GIVEN
      process.env.AUTHORIZATION_SECRET = 'secret';
      process.env.BACKEND_URL = mockedUrl;
      const pendingAuthRequest: AuthorizationRequestDTO = {
        apiToken: mockedToken,
        projectId: mockedProviderProjectId,
        integratorId: mockedIntegratorId,
        members: mocksAdministratorDTO,
        organizationName: mockedOrganizationName,
        issueProviderName: mockedIssueProviderId,
      };
      integrationRepositoryMock.createIntegrationProjectRequest.mockImplementation(async () => mockPendingProjectAuthorizationDTO);
      adapterMock.getMemberById.mockResolvedValue(mockUserDataDTO);
      adapterMock.getProjectById.mockResolvedValue(mockBasicProjectDataDTO);
      administratorRepositoryMock.getByOrganizationName.mockResolvedValue(mocksAdministratorDTO);
      emailServiceMock.sendAuthorizationMail.mockResolvedValue();

      // WHEN
      const actualPendingAuthorization = await testedService.createPendingAuthorization(pendingAuthRequest);

      // THEN
      const expectedAuthRequest: PendingProjectAuthorizationDTO = {
        id: mockedGeneratedId,
        providerProjectId: mockedProviderProjectId,
        token: mockedEncryptedToken,
        issueProviderId: mockedIssueProviderId,
        integratorId: mockedIntegratorId,
        organizationId: mockedOrganizationId,
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
      adapterMock.getMembersByProjectId.mockResolvedValue(mockProjectMembers);
      const expected: ProjectMemberDataDTO[] = [mockProjectMember1, mockProjectMember2, mockProjectMember3]; // ordered array

      // when
      const received: ProjectMemberDataDTO[] = await testedService.getMembers(mockedProviderProjectId, mockedToken);

      // then
      expect.assertions(3);
      expect(received[0].name).toEqual(expected[0].name);
      expect(received[1].name).toEqual(expected[1].name);
      expect(received[2].email).toEqual(expected[2].email);
    });
  });
});
