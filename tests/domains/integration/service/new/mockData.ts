import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type UserDataDTO } from '@domains/user';
import { type BasicProjectDataDTO } from '@domains/project/dto';
import { type AdministratorDTO } from '@domains/administrator/dto';
import { type AuthorizationEmailVariables } from '@domains/email/dto';

export const mockedAdminId = 'mockedAdminId';
export const mockedAdminEmail = 'admin@example.com';
export const mockedGeneratedId = 'mockedId';
export const mockedMemberName = 'John Doe';
export const mockedProjectName = 'Example Project';
export const mockedEmail = 'john.doe@example.com';
export const mockedIntegratorId = 'integrator123';
export const mockedIssueProviderId = 'issueProvider456';
export const mockedIssueProviderName = 'exampleProvider';
export const mockedOrganizationId = 'org789';
export const mockedOrganizationName = 'exampleOrganization';
export const mockedProviderProjectId = 'project987';
export const mockedToken = 'token123';
export const mockedEncryptedToken = 'encryptedToken123';
export const mockedIntegratorName = 'John Doe';
export const mockedUrl = 'mockedurl.com';

export const mockPendingProjectAuthorizationDTO: PendingProjectAuthorizationDTO = {
  id: mockedGeneratedId,
  integratorId: mockedIntegratorId,
  issueProviderId: mockedIssueProviderId,
  organizationId: mockedOrganizationId,
  providerProjectId: mockedProviderProjectId,
  token: mockedEncryptedToken,
};

export const mockUserDataDTO: UserDataDTO = {
  name: mockedMemberName,
};

export const mockBasicProjectDataDTO: BasicProjectDataDTO = {
  name: mockedProjectName,
  id: mockedProviderProjectId,
};

export const mocksAdministratorDTO: AdministratorDTO[] = [
  {
    id: mockedAdminId + '1',
    email: '1' + mockedAdminEmail,
  },
  {
    id: mockedAdminId + '2',
    email: '2' + mockedAdminEmail,
  },
];
export const mocksAuthorizationEmailVariables: AuthorizationEmailVariables = {
  acceptanceToken: mockedToken,
  denialToken: mockedToken,
  projectName: mockedProjectName,
  projectId1: mockedProviderProjectId,
  projectId2: mockedProviderProjectId,
  integratorName: mockedIntegratorName,
  denialUrl: mockedUrl,
  acceptanceUrl: mockedUrl,
};
