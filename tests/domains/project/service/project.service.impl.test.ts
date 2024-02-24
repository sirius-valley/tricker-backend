import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { db } from '@utils';
import { UserDTO, type UserRepository } from '@domains/user';
import { type RoleRepository } from '@domains/role/repository';
import { type ProjectRepository } from '@domains/project/repository';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { RoleRepositoryMock } from '../../role/mockRepository/role.repository.mock';
import { LinearAdapterMock } from '../../adapter/mockLinearAdapter/linearAdapter.mock';
import { UserRepositoryMock } from '../../user/mockRepository/user.repository.mock';
import { ProjectDataDTO, ProjectDTO } from '@domains/project/dto';
import { ProjectRepositoryMock } from '../mockRepository/project.repository.mock';

let userMockRepository: UserRepository;
let roleMockRepository: RoleRepository;
let projectMockRepository: ProjectRepository;
let mockAdapterTool: ProjectManagementTool;
let service: ProjectService;
let user: UserDTO;
let project: ProjectDTO;
let projectData: ProjectDataDTO;

describe('Integrate project method tests', () => {
  before(() => {
    userMockRepository = new UserRepositoryMock();
    roleMockRepository = new RoleRepositoryMock();
    mockAdapterTool = new LinearAdapterMock();
    projectMockRepository = new ProjectRepositoryMock();
    service = new ProjectServiceImpl(mockAdapterTool, projectMockRepository, userMockRepository, roleMockRepository);
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
    projectData = new ProjectDataDTO('idP', [{ email: 'mockUser@mock.com', role: 'Project Manager' }], 'Tricker', [], [], null);
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
    mock.method(mockAdapterTool, 'integrateProjectData').mock.mockImplementation(() => {
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
});
