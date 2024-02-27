import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { db } from '@utils';
import { UserDTO, type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { LinearAdapterMock } from '../../adapter/mockLinearAdapter/linearAdapter.mock';
import { UserRepositoryMock } from '../../user/mockRepository/user.repository.mock';
import { ProjectDataDTO, ProjectDTO } from '@domains/project/dto';
import { ProjectRepositoryMock } from '../../project/mockRepository/project.repository.mock';
import { type IntegrationService, IntegrationServiceImpl } from '@domains/integration/service';
import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository';
import { type PendingMemberMailsRepository } from 'domains/pendingMemberMail/repository';
import { type OrganizationRepository } from '@domains/organization/repository';
import { OrganizationMockRepository } from '../../organization/mockRepository/organization.mock.repository';
import { PendingMemberMailsMockRepository } from '../../pendingMemberMails/mockRepository/pendingMemberMails.mock.repository';
import { PendingProjectAuthorizationMockRepository } from '../../pendingProjectAuthorization/mockRepository/pendingProjectAuthorization.mock.repository';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { PendingMemberMailDTO } from 'domains/pendingMemberMail/dto';
import { OrganizationDTO } from '@domains/organization/dto';

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

describe('Integrate project method tests', () => {
  before(() => {
    userMockRepository = new UserRepositoryMock();
    mockAdapterTool = new LinearAdapterMock();
    projectMockRepository = new ProjectRepositoryMock();
    organizationMockRepository = new OrganizationMockRepository();
    pendingMemberMailsMockRepository = new PendingMemberMailsMockRepository();
    pendingAuthProjectMockRepository = new PendingProjectAuthorizationMockRepository();
    service = new IntegrationServiceImpl(mockAdapterTool, projectMockRepository, userMockRepository, pendingAuthProjectMockRepository, pendingMemberMailsMockRepository, organizationMockRepository);
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
    projectData = new ProjectDataDTO('idP', [{ email: 'mockUser@mock.com', role: 'Project Manager' }], 'Tricker', [], [], null);
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
    /* userProjectRole = new UserProjectRoleDTO({
      id: 'idUPR',
      userId: 'userId',
      projectId: 'idP',
      roleId: 'idR',
      userEmitterId: 'idE',
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      updatedAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
    }); */
  });

  beforeEach(() => {
    mock.restoreAll();
  });

  it('Should successfully integrate a project to tricker', async () => {
    mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
      return user;
    });
    mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return null;
    });
    mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
      return pendingProject;
    });
    mock.method(pendingMemberMailsMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
      return [pendingMemberMail];
    });
    mock.method(organizationMockRepository, 'getByName').mock.mockImplementation(async () => {
      return organization;
    });
    mock.method(mockAdapterTool, 'adaptProjectData').mock.mockImplementation(() => {
      return projectData;
    });
    mock.method(db, '$transaction').mock.mockImplementation(() => {
      return project;
    });

    const expectedProject: ProjectDTO = project;
    const receivedProject: ProjectDTO = await service.integrateProject('id', 'idE');

    assert.strictEqual(expectedProject.id, receivedProject.id);
    assert.equal(receivedProject.createdAt.toISOString(), expectedProject.createdAt.toISOString());
  });

  it('Should throw exception when user is null', async () => {
    mock.method(userMockRepository, 'getById').mock.mockImplementation(() => {
      return null;
    });

    await assert.rejects(
      async () => {
        await service.integrateProject('8', 'idNull');
      },
      { message: "Not found. Couldn't find User" }
    );
  });

  it('Should throw exception when project has already been integrated', () => {
    mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(async () => {
      return user;
    });
    mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return project;
    });

    assert.rejects(
      async () => {
        await service.integrateProject('8', 'idNull');
      },
      { message: 'Conflict. Project has been already integrated' }
    );
  });

  it('Should throw exception when project is inactive', () => {
    mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(async () => {
      return user;
    });
    mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return { ...project, deletedAt: new Date('2023-11-18T19:28:40.065Z') };
    });

    assert.rejects(
      async () => {
        await service.integrateProject('8', 'idNull');
      },
      { message: 'Conflict. Project is currently inactive. Please, re-active it if you need' }
    );
  });

  it('Should throw an exception if there is not a pending project with the provided Id', async () => {
    mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
      return user;
    });
    mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return null;
    });
    mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
      return null;
    });

    await assert.rejects(
      async () => {
        await service.integrateProject('8', 'idNull');
      },
      { message: "Not found. Couldn't find PendingAuthProject" }
    );
  });

  it('Should throw an exception if there is not an organization with the provided name', async () => {
    mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
      return user;
    });
    mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return null;
    });
    mock.method(pendingAuthProjectMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
      return pendingProject;
    });
    mock.method(pendingMemberMailsMockRepository, 'getByProjectId').mock.mockImplementation(async () => {
      return [pendingMemberMail];
    });
    mock.method(organizationMockRepository, 'getByName').mock.mockImplementation(async () => {
      return null;
    });

    await assert.rejects(
      async () => {
        await service.integrateProject('8', 'idNull');
      },
      { message: "Not found. Couldn't find Organization" }
    );
  });
});
