import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { db } from '@utils';
import { UserDTO, type UserRepository } from '@domains/user';
import { type RoleRepository } from '@domains/role/repository';
import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { RoleRepositoryMock } from '../../role/mockRepository/role.repository.mock';
import { UserProjectRoleRepositoryMock } from '../../userProjectRole/mockRepository/userProjectRole.repository.mock';
import { LinearAdapterMock } from '../../adapter/mockLinearAdapter/linearAdapter.mock';
import { type UserProjectRoleService, UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { UserRepositoryMock } from '../../user/mockRepository/user.repository.mock';
import { ProjectDataDTO, ProjectDTO } from '@domains/project/dto';
import { UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { ProjectRepositoryMock } from '../mockRepository/project.repository.mock';
import { type IssueProviderRepository } from 'domains/issueProvider/repository';
import { ManagementProviderRepositoryMock } from '../../managementProvider/mockRepository/managementProvider.repository.mock';
import { IssueProviderDTO } from 'domains/issueProvider/dto';
import { type ProjectPreIntegratedDTO } from '@domains/integration/dto';

let userMockRepository: UserRepository;
let roleMockRepository: RoleRepository;
let UPRMockRepository: UserProjectRoleRepository;
let projectMockRepository: ProjectRepository;
let mockAdapterTool: ProjectManagementTool;
let userProjectRoleService: UserProjectRoleService;
let service: ProjectService;
let user: UserDTO;
let project: ProjectDTO;
let projectData: ProjectDataDTO;
let userProjectRole: UserProjectRoleDTO;
let managementProviderRepository: IssueProviderRepository;
let managementProvider: IssueProviderDTO;

describe('Project service', () => {
  before(() => {
    userMockRepository = new UserRepositoryMock();
    roleMockRepository = new RoleRepositoryMock();
    UPRMockRepository = new UserProjectRoleRepositoryMock();
    mockAdapterTool = new LinearAdapterMock();
    projectMockRepository = new ProjectRepositoryMock();
    userProjectRoleService = new UserProjectRoleServiceImpl(UPRMockRepository, userMockRepository, projectMockRepository, roleMockRepository);
    managementProviderRepository = new ManagementProviderRepositoryMock();
    service = new ProjectServiceImpl(mockAdapterTool, projectMockRepository, userMockRepository, managementProviderRepository);
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
      image: 'url',
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
    });
    projectData = new ProjectDataDTO('idP', [{ email: 'mockUser@mock.com', role: 'Project Manager' }], 'Tricker', [], null);
    userProjectRole = new UserProjectRoleDTO({
      id: 'idUPR',
      userId: 'userId',
      projectId: 'idP',
      roleId: 'idR',
      userEmitterId: 'idE',
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      updatedAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
    });
    managementProvider = new IssueProviderDTO({
      id: 'mpId',
      name: 'Linear',
    });
  });

  beforeEach(() => {
    mock.restoreAll();
  });

  describe('retrieveProjectsFromProvider method', () => {
    it('should successfully retrieve a projects list', async () => {
      mock.method(managementProviderRepository, 'getByName').mock.mockImplementation(async () => {
        return managementProvider;
      });
      mock.method(mockAdapterTool, 'validateSecret').mock.mockImplementation(() => {});
      mock.method(mockAdapterTool, 'getProjects').mock.mockImplementation(async () => {
        return [{ providerProjectId: 'ppID', image: undefined, name: 'Tricker' }];
      });

      const expected: ProjectPreIntegratedDTO[] = [{ providerProjectId: 'ppID', image: undefined, name: 'Tricker' }];
      const received: ProjectPreIntegratedDTO[] = await service.retrieveProjectsFromProvider('Linear', 'mock_secret');

      assert.strictEqual(expected[0].providerProjectId, received[0].providerProjectId);
      assert.equal(received.length, 1);
    });

    it('should throw an error when the manager provider name is not supported', async () => {
      mock.method(managementProviderRepository, 'getByName').mock.mockImplementation(async () => {
        return null;
      });

      await assert.rejects(
        async () => {
          await service.retrieveProjectsFromProvider('NotExistingProvider', 'mock_secret');
        },
        { message: "Not found. Couldn't find ManagementProvider" }
      );
    });

    it('should throw an error when the sent secret is undefined', async () => {
      mock.method(managementProviderRepository, 'getByName').mock.mockImplementation(async () => {
        return managementProvider;
      });

      await assert.rejects(
        async () => {
          await service.retrieveProjectsFromProvider('Linear', undefined);
        },
        { message: 'MISSING_SECRET' }
      );
    });

    it('should throw an error when the sent secret is an empty string', async () => {
      mock.method(managementProviderRepository, 'getByName').mock.mockImplementation(async () => {
        return managementProvider;
      });

      await assert.rejects(
        async () => {
          await service.retrieveProjectsFromProvider('Linear', '');
        },
        { message: 'MISSING_SECRET' }
      );
    });

    it('should throw an error when the sent secret is not valid', async () => {
      mock.method(managementProviderRepository, 'getByName').mock.mockImplementation(async () => {
        return managementProvider;
      });

      await assert.rejects(
        async () => {
          await service.retrieveProjectsFromProvider('Linear', 'not_valid_Secret');
        },
        { message: 'NOT_VALID_SECRET' }
      );
    });
  });

  describe('Integrate project method tests', () => {
    it('Should successfully integrate a project to tricker', async () => {
      mock.method(userMockRepository, 'getByProviderId').mock.mockImplementation(() => {
        return user;
      });
      mock.method(projectMockRepository, 'getByProviderId').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
        return null;
      });
      mock.method(mockAdapterTool, 'integrateProjectData').mock.mockImplementation(() => {
        return projectData;
      });
      mock.method(userProjectRoleService, 'create').mock.mockImplementation(() => {
        return userProjectRole;
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
  });
});
