import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { db } from '@utils';
import { UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { LinearAdapterMock } from '../../adapter/mockLinearAdapter/linearAdapter.mock';
import { UserRepositoryMock } from '../../user/mockRepository/user.repository.mock';
import { ProjectDTO } from '@domains/project/dto';
import { ProjectRepositoryMock } from '../../project/mockRepository/project.repository.mock';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository';
import { type PendingMemberMailsRepository } from 'domains/pendingMemberMail/repository';
import { type OrganizationRepository } from '@domains/organization/repository';
import { OrganizationRepositoryMock } from '../../organization/mockRepository/organization.repository.mock';
import { PendingMemberMailsRepositoryMock } from '../../pendingMemberMails/mockRepository/pendingMemberMails.repository.mock';
import { PendingProjectAuthorizationRepositoryMock } from '../../pendingProjectAuthorization/mockRepository/pendingProjectAuthorization.repository.mock';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { PendingMemberMailDTO } from 'domains/pendingMemberMail/dto';
import { OrganizationDTO } from '@domains/organization/dto';
import { ProjectDataDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type IssueProviderRepository } from '@domains/issueProvider/repository';
import { IssueProviderRepositoryMock } from '../../issueProvider/mockRepository/IssueProvider.repository.mock';
import { IssueProviderDTO } from '@domains/issueProvider/dto';
import { type EmailService, MailgunEmailService } from '@domains/email/service';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

let userMockRepository: UserRepository;
let projectMockRepository: ProjectRepository;
let mockAdapterTool: ProjectManagementToolAdapter;
let pendingAuthProjectMockRepository: PendingProjectAuthorizationRepository;
let pendingMemberMailsMockRepository: PendingMemberMailsRepository;
let organizationMockRepository: OrganizationRepository;
let issueProviderMockRepository: IssueProviderRepository;
let service: IntegrationService;
let user: UserDTO;
let project: ProjectDTO;
let projectData: ProjectDataDTO;
let pendingProject: PendingProjectAuthorizationDTO;
let pendingMemberMail: PendingMemberMailDTO;
let organization: OrganizationDTO;
let issueProvider: IssueProviderDTO;
let emailSender: EmailService;

describe('Integration service', () => {
  before(() => {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY! });
    // eslint-disable-next-line no-import-assign
    emailSender = new MailgunEmailService(mg);
    userMockRepository = new UserRepositoryMock();
    mockAdapterTool = new LinearAdapterMock();
    projectMockRepository = new ProjectRepositoryMock();
    organizationMockRepository = new OrganizationRepositoryMock();
    pendingMemberMailsMockRepository = new PendingMemberMailsRepositoryMock();
    pendingAuthProjectMockRepository = new PendingProjectAuthorizationRepositoryMock();
    issueProviderMockRepository = new IssueProviderRepositoryMock();
    service = new IntegrationServiceImpl(mockAdapterTool, projectMockRepository, userMockRepository, pendingAuthProjectMockRepository, pendingMemberMailsMockRepository, organizationMockRepository, issueProviderMockRepository, emailSender);
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
    projectData = new ProjectDataDTO('idP', [{ email: 'mockUser@mock.com', name: 'John Doe', providerId: 'pId' }], 'Tricker', [], [], null);
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
    issueProvider = new IssueProviderDTO({
      id: 'ipId',
      name: 'Linear',
    });
  });

  beforeEach(() => {
    mock.restoreAll();
  });

  describe('Integrate project method tests', () => {
    it('Should successfully integrate a project to tricker', async () => {
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return null;
      });
      mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return pendingProject;
      });
      mock.method(pendingMemberMailsMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return [{ ...pendingMemberMail, email: 'mail@mail.com' }];
      });
      mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
        return user;
      });
      mock.method(organizationMockRepository, 'getById').mock.mockImplementation(async () => {
        return organization;
      });
      mock.method(mockAdapterTool, 'adaptProjectData').mock.mockImplementation(() => {
        return { ...projectData, members: [{ ...pendingMemberMail, email: 'mail@mail.com' }] };
      });
      mock.method(db, '$transaction').mock.mockImplementation(() => {
        return project;
      });
      mock.method(emailSender, 'sendConfirmationMail').mock.mockImplementation(() => {});

      const expectedProject: ProjectDTO = project;
      const receivedProject: ProjectDTO = await service.integrateProject('id');

      assert.strictEqual(expectedProject.id, receivedProject.id);
      assert.equal(receivedProject.createdAt.toISOString(), expectedProject.createdAt.toISOString());
    });

    it('Should throw exception when user is null', async () => {
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return null;
      });
      mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return pendingProject;
      });
      mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
        return null;
      });

      await assert.rejects(
        async () => {
          await service.integrateProject('8');
        },
        { message: "Not found. Couldn't find User" }
      );
    });

    it('Should throw exception when project has already been integrated', () => {
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return project;
      });

      assert.rejects(
        async () => {
          await service.integrateProject('8');
        },
        { message: 'Conflict. Project has been already integrated' }
      );
    });

    it('Should throw exception when project is inactive', () => {
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return { ...project, deletedAt: new Date('2023-11-18T19:28:40.065Z') };
      });

      assert.rejects(
        async () => {
          await service.integrateProject('8');
        },
        { message: 'Conflict. Project is currently inactive. Please, re-active it if you need' }
      );
    });

    it('Should throw an exception if there is not a pending project with the provided Id', async () => {
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return null;
      });
      mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return null;
      });

      await assert.rejects(
        async () => {
          await service.integrateProject('8');
        },
        { message: "Not found. Couldn't find PendingAuthProject" }
      );
    });

    it('Should throw an exception if there is not an organization with the provided name', async () => {
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return null;
      });
      mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return pendingProject;
      });
      mock.method(pendingMemberMailsMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return [pendingMemberMail];
      });
      mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
        return user;
      });
      mock.method(organizationMockRepository, 'getById').mock.mockImplementation(async () => {
        return null;
      });

      await assert.rejects(
        async () => {
          await service.integrateProject('8');
        },
        { message: "Not found. Couldn't find Organization" }
      );
    });

    it('Should throw an exception if project manager is not included in accepted users', async () => {
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return null;
      });
      mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return pendingProject;
      });
      mock.method(pendingMemberMailsMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
        return [pendingMemberMail];
      });
      mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
        return user;
      });
      mock.method(organizationMockRepository, 'getById').mock.mockImplementation(async () => {
        return organization;
      });
      mock.method(mockAdapterTool, 'adaptProjectData').mock.mockImplementation(() => {
        return projectData;
      });

      await assert.rejects(
        async () => {
          await service.integrateProject('8');
        },
        { message: 'Conflict. Provided Project Manager email not correct.' }
      );
    });
  });

  describe('retrieveProjectsFromProvider method', () => {
    it('should successfully retrieve a projects list', async () => {
      mock.method(issueProviderMockRepository, 'getByName').mock.mockImplementation(async () => {
        return issueProvider;
      });
      mock.method(service, 'validateIdentity').mock.mockImplementation(async () => {});
      mock.method(mockAdapterTool, 'getAndAdaptProjects').mock.mockImplementation(async () => {
        return [{ providerProjectId: 'ppID', image: undefined, name: 'Tricker' }];
      });

      const expected: ProjectPreIntegratedDTO[] = [{ providerProjectId: 'ppID', image: null, name: 'Tricker' }];
      const received: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider({ providerName: 'Linear', apyKey: 'mock_secret', pmProviderId: 'mail@mail.com' });

      assert.strictEqual(expected[0].providerProjectId, received[0].providerProjectId);
      assert.equal(received.length, 1);
    });

    it('should throw an error when the manager provider name is not supported', async () => {
      mock.method(issueProviderMockRepository, 'getByName').mock.mockImplementation(async () => {
        return null;
      });

      await assert.rejects(
        async () => {
          await service.retrieveProjectsFromProvider({ providerName: 'NotExistingProvider', apyKey: 'mock_secret', pmProviderId: 'mail@mail.com' });
        },
        { message: "Not found. Couldn't find IssueProvider" }
      );
    });

    it('should throw an error when the provider apikey is not correct', async () => {
      mock.method(issueProviderMockRepository, 'getByName').mock.mockImplementation(async () => {
        return null;
      });

      await assert.rejects(
        async () => {
          await service.retrieveProjectsFromProvider({ providerName: 'NotExistingProvider', apyKey: 'mock_secret', pmProviderId: 'mail@mail.com' });
        },
        { message: "Not found. Couldn't find IssueProvider" }
      );
    });
  });
});
