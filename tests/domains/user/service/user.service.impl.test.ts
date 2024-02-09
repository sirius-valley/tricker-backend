import { before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { NotFoundException } from '@utils';
import { UserServiceImpl, type UserService } from '@domains/user/service';
import { UserDTO, type UserRepository } from '@domains/user';
import { UserMockRepository } from '../mockRepository/userMockRepository';

let mockRepository: UserRepository;
let service: UserService;
let user: UserDTO;

describe('user getById tests', () => {
  before(() => {
    mockRepository = new UserMockRepository();
    service = new UserServiceImpl(mockRepository);
    user = new UserDTO({
      id: 'id',
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
    const recievedUser: UserDTO = await service.getById('id');

    assert.strictEqual(user.id, recievedUser.id);
    assert.equal(recievedUser.createdAt.toISOString(), user.createdAt.toISOString());
  });

  it('Should throw exception when user is null', async () => {
    try {
      await service.getById('nullId');
    } catch (error) {
      assert.ok(error instanceof NotFoundException);
    }
  });
});
