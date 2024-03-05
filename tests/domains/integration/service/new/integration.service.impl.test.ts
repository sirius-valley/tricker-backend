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
} from './mockData';
import { type AuthorizationRequest } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

describe('new integration service tests', () => {
  const adapterMock: MockProxy<ProjectManagementToolAdapter> = mock<ProjectManagementToolAdapter>();
  const projectRepositoryMock: MockProxy<ProjectRepository> = mock<ProjectRepository>();
  const userRepositoryMock: MockProxy<UserRepository> = mock<UserRepository>();
  const pendingAuthProjectRepositoryMock: MockProxy<PendingProjectAuthorizationRepository> = mock<PendingProjectAuthorizationRepository>();
  const pendingMemberMailsRepositoryMock: MockProxy<PendingMemberMailsRepository> = mock<PendingMemberMailsRepository>();
  const organizationRepositoryMock: MockProxy<OrganizationRepository> = mock<OrganizationRepository>();
  const administratorRepositoryMock: MockProxy<AdministratorRepository> = mock<AdministratorRepository>();
  const integrationRepositoryMock: MockProxy<IntegrationRepository> = mock<IntegrationRepository>();
  const emailServiceMock: MockProxy<EmailService> = mock<EmailService>();
  let testedService: IntegrationService;

  beforeEach(() => {
    jest.resetAllMocks();
    testedService = new IntegrationServiceImpl(adapterMock, projectRepositoryMock, userRepositoryMock, pendingAuthProjectRepositoryMock, pendingMemberMailsRepositoryMock, organizationRepositoryMock, administratorRepositoryMock, integrationRepositoryMock, emailServiceMock);
  });

  it('should create a pending project authorization successfully', async () => {
    // GIVEN
    process.env.AUTHORIZATION_SECRET = 'secret';
    const pendingAuthRequest: AuthorizationRequest = {
      apiToken: mockedToken,
      projectId: mockedProviderProjectId,
      integratorId: mockedIntegratorId,
      members: mocksAdministratorDTO,
      organizationName: mockedOrganizationId,
      issueProviderName: mockedIssueProviderId,
    };
    integrationRepositoryMock.createIntegrationProjectRequest.mockImplementation(async () => mockPendingProjectAuthorizationDTO);
    adapterMock.getMemberById.mockResolvedValue(mockUserDataDTO);
    adapterMock.getProjectById.mockResolvedValue(mockBasicProjectDataDTO);
    administratorRepositoryMock.getByName.mockResolvedValue(mocksAdministratorDTO);
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
    expect(emailServiceMock.sendAuthorizationMail).toHaveBeenNthCalledWith(1, '1' + mockedAdminEmail, { integratorName: mockedMemberName, projectName: mockedProjectName, token: expect.any(String) });
    expect(emailServiceMock.sendAuthorizationMail).toHaveBeenNthCalledWith(2, '2' + mockedAdminEmail, { integratorName: mockedMemberName, projectName: mockedProjectName, token: expect.any(String) });
    expect(actualPendingAuthorization).toEqual(expectedAuthRequest);
  });
});
