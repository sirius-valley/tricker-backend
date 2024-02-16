import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { NotFoundException } from '@utils';
import { UserServiceImpl, type UserService } from '@domains/user/service';
import { UserDTO, type UserRepository } from '@domains/user';
import { UserRepositoryMock } from '../mockRepository/user.repository.mock';

let mockRepository: UserRepository;
let service: UserService;
let user: UserDTO;

describe('linear adapter tests', () => {
  before(() => {
    mockRepository = new UserRepositoryMock();
    service = new UserServiceImpl(mockRepository);
    user = new UserDTO({
      id: 'id',
      cognitoId: 'cogId',
      email: 'mail@mail.com',
      name: 'random name',
      profileImage: null,
      projectsRoleAssigned: [],
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
      emittedUserProjectRole: [],
    });
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
