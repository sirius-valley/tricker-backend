import { UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type UserService, UserServiceImpl } from '@domains/user/service';
import { createMockContext, type MockContext } from '@context';
import type { PrismaClient } from '@prisma/client';
import { NotFoundException } from '@utils';

let mockRepository: UserRepository;
let service: UserService;
let user: UserDTO;
let prismaMockCtx: MockContext;
let prismaMock: PrismaClient;

beforeEach(() => {
  prismaMockCtx = createMockContext();
  prismaMock = prismaMockCtx.prisma;
  mockRepository = new UserRepositoryImpl(prismaMock);
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

describe('user service tests', () => {
  it('Should successfully get a user by a provided id', async () => {
    jest.spyOn(mockRepository, 'getByProviderId').mockResolvedValue(user);
    const receivedUser: UserDTO = await service.getByProviderUserId('id');

    expect.assertions(2);

    expect(receivedUser.id).toEqual(user.id);
    expect(receivedUser.createdAt.toISOString()).toEqual(user.createdAt.toISOString());
  });

  it('Should throw exception when user is null', async () => {
    jest.spyOn(mockRepository, 'getByProviderId').mockResolvedValue(null);

    expect.assertions(2);

    await expect(service.getByProviderUserId('id')).rejects.toThrow(NotFoundException);
    await expect(service.getByProviderUserId('id')).rejects.toThrow("Not found. Couldn't find User");
  });
});
