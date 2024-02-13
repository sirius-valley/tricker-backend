import { UserDTO, type UserRepository } from '@domains/user';
import type { RoleRepository } from '@domains/role/repository';
import type { UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import type { ProjectRepository } from '@domains/project/repository';
import { type UserProjectRoleService, UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { ProjectDTO } from '@domains/project/dto';
import { UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { before, beforeEach, describe, it, mock } from 'node:test';
import { UserRepositoryMock } from '../../user/mockRepository/user.repository.mock';
import { RoleRepositoryMock } from '../../role/mockRepository/role.repository.mock';
import { UserProjectRoleRepositoryMock } from '../mockRepository/userProjectRole.repository.mock';
import { ProjectRepositoryMock } from '../../project/mockRepository/project.repository.mock';
import assert from 'node:assert';
import { RoleDTO } from '@domains/role/dto';

let userMockRepository: UserRepository;
let roleMockRepository: RoleRepository;
let UPRMockRepository: UserProjectRoleRepository;
let projectMockRepository: ProjectRepository;
let service: UserProjectRoleService;
let user: UserDTO;
let project: ProjectDTO;
let role: RoleDTO;
let userProjectRole: UserProjectRoleDTO;

describe('Method create userProjectRole tests', () => {
  before(() => {
    userMockRepository = new UserRepositoryMock();
    roleMockRepository = new RoleRepositoryMock();
    UPRMockRepository = new UserProjectRoleRepositoryMock();
    projectMockRepository = new ProjectRepositoryMock();
    service = new UserProjectRoleServiceImpl(UPRMockRepository, userMockRepository, projectMockRepository, roleMockRepository);
    user = new UserDTO({
      id: 'userId',
      profileImage: null,
      projectsRoleAssigned: [],
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
      emittedUserProjectRole: [],
    });
    project = new ProjectDTO({
      id: 'idP',
      name: 'Tricker',
      url: 'url',
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
    });
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
    role = new RoleDTO({
      id: 'idR',
      name: 'Project Manager',
    });
  });

  beforeEach(() => {
    mock.restoreAll();
  });

  it('Should successfully create a userProjectRole register', async () => {
    mock.method(userMockRepository, 'getById').mock.mockImplementation(() => {
      return user;
    });
    mock.method(projectMockRepository, 'getById').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return project;
    });
    mock.method(roleMockRepository, 'getById').mock.mockImplementation(() => {
      return role;
    });
    mock.method(userMockRepository, 'getById').mock.mockImplementation(() => {
      return user;
    });

    const expectedUserProjectRole: UserProjectRoleDTO = userProjectRole;
    const receivedUserProjectRole: UserProjectRoleDTO = await service.create('userId', 'idP', 'idR', 'idE');

    assert.strictEqual(expectedUserProjectRole.id, receivedUserProjectRole.id);
    assert.equal(receivedUserProjectRole.createdAt.toISOString(), expectedUserProjectRole.createdAt.toISOString());
  });

  it('Should throw exception when user is null', async () => {
    mock.method(userMockRepository, 'getById').mock.mockImplementation(() => {
      return null;
    });

    await assert.rejects(
      async () => {
        await service.create('userId', 'idP', 'idR', 'idE');
      },
      { message: "Not found. Couldn't find User" }
    );
  });

  it('Should throw exception when role is null', async () => {
    mock.method(userMockRepository, 'getById').mock.mockImplementation(() => {
      return user;
    });
    mock.method(projectMockRepository, 'getById').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return project;
    });
    mock.method(roleMockRepository, 'getById').mock.mockImplementation(() => {
      return null;
    });

    await assert.rejects(
      async () => {
        await service.create('userId', 'idP', 'idR', 'idE');
      },
      { message: "Not found. Couldn't find Role" }
    );
  });

  it('Should throw exception when emitter user is null', async () => {
    mock.method(userMockRepository, 'getById').mock.mockImplementation(() => {
      return user;
    });
    mock.method(projectMockRepository, 'getById').mock.mockImplementation(async (): Promise<ProjectDTO | null> => {
      return project;
    });
    mock.method(roleMockRepository, 'getById').mock.mockImplementation(() => {
      return role;
    });
    mock.method(userMockRepository, 'getById').mock.mockImplementation(() => {
      return null;
    });

    await assert.rejects(
      async () => {
        await service.create('userId', 'idP', 'idR', 'idE');
      },
      { message: "Not found. Couldn't find User" }
    );
  });
});
