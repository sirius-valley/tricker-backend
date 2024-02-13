/* import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { NotFoundException } from '@utils';
import { UserDTO, type UserRepository } from '@domains/user';
import { UserRepositoryMock } from '../mockRepository/user.repository.mock';
import { RoleRepository } from '@domains/role/repository';
import { UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { ProjectRepository } from '@domains/project/repository';
import { LinearAdapter } from '@domains/adapter/linearAdapter/linear.adapter';
import {ProjectService, ProjectServiceImpl} from '@domains/project/service';
import {ProjectManagementTool} from "@domains/adapter/projectManagementTool";
import {RoleRepositoryMock} from "../../role/mockRepository/role.repository.mock";
import {UserProjectRoleRepositoryMock} from "../../userProjectRole/mockRepository/userProjectRole.repository.mock";

let userMockRepository: UserRepository;
let roleMockRepository: RoleRepository;
let UPRMockRepository: UserProjectRoleRepository;
let projectMockRepository: ProjectRepository;
let mockLinearAdapter: ProjectManagementTool;
let service: ProjectService;

describe('linear adapter tests', () => {
  before(() => {
    userMockRepository = new UserRepositoryMock();
    roleMockRepository = new RoleRepositoryMock();
    UPRMockRepository = new UserProjectRoleRepositoryMock();
    mockLinearAdapter = new LinearAdapter()
    service = new ProjectServiceImpl(mockRepository);
  });

  beforeEach(() => {
    mock.restoreAll();
  });

  it('Should successfully get a user by a provided id', async () => {
    const receivedUser: UserDTO = await service.getById('id');

    assert.strictEqual(user.id, receivedUser.id);
    assert.equal(receivedUser.createdAt.toISOString(), user.createdAt.toISOString());
  });

  it('Should throw exception when user is null', async () => {
    try {
      await service.getById('nullId');
    } catch (error) {
      assert.ok(error instanceof NotFoundException);
    }
  });
});
*/
