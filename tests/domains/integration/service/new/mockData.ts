import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type UserData } from '@domains/user';
import { type BasicProjectDataDTO } from '@domains/project/dto';
import { type AdministratorDTO } from '@domains/administrator/dto';
import { type AuthorizationEmailVariables } from '@domains/email/dto';
import type { PendingProjectInfoDTO, ProjectMemberDataDTO } from '@domains/integration/dto';

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
  isIntegrating: false,
};

export const mockUserDataDTO: UserData = {
  name: mockedMemberName,
  email: 'mockedEmail@mail.com',
  image: null,
};

export const mockBasicProjectDataDTO: BasicProjectDataDTO = {
  name: mockedProjectName,
  id: mockedProviderProjectId,
  projectUrl: 'someUrl',
  projectImage: undefined,
};

export const mockPendingProjectInfoDTO: PendingProjectInfoDTO = {
  projectName: 'Example Project',
  projectImage: null,
  pmName: 'John Doe',
  pmImage: null,
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

export const mockProjectMember1: ProjectMemberDataDTO = {
  email: 'firstEmail@mail.com',
  name: 'First Person',
  providerId: 'user111',
};

export const mockProjectMember2: ProjectMemberDataDTO = {
  email: 'secondEmail@mail.com',
  name: 'Second Person',
  providerId: 'user222',
};

export const mockProjectMember3: ProjectMemberDataDTO = {
  email: 'thirdEmail@mail.com',
  name: 'Third Person',
  providerId: 'user111',
};

export const mockProjectMembers: ProjectMemberDataDTO[] = [mockProjectMember3, mockProjectMember1, mockProjectMember2];
