import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
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
import { AuthorizationRequestDTO, AuthorizedMemberDTO, type PendingProjectInfoDTO, type ProjectMemberDataDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type NextFunction, type Request, type Response } from 'express';
import { ConflictException, IsValidIssueProviderConstraint, IsValidOrganizationConstraint, NotFoundException, validateRequest } from '@utils';
import { plainToInstance } from 'class-transformer';
import * as auth from '@utils/auth';
import { mockProjectDTO, mockUserDTO } from '../../../issue/mockData';
import jwt from 'jsonwebtoken';
import { adapterFactoryMock, administratorRepositoryMock, emailServiceMock, integrationRepositoryMock, linearAdapterMock, organizationRepositoryMock, pendingAuthProjectRepositoryMock, pendingMemberMailsRepositoryMock, projectRepositoryMock, userRepositoryMock } from '../../../mock/mock';

describe('integration service tests', () => {
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
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockedToken);
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
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockedToken);
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
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockedToken);
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
      jest.spyOn(auth, 'decryptData').mockImplementation(() => mockedToken);
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
