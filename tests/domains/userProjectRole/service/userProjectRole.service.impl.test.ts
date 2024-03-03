import { UserDTO, type UserRepository, UserRepositoryImpl } from '@domains/user';
import { type RoleRepository, RoleRepositoryImpl } from '@domains/role/repository';
import { type UserProjectRoleRepository, UserProjectRoleRepositoryImpl } from '@domains/userProjectRole/repository';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { type UserProjectRoleService, UserProjectRoleServiceImpl } from '@domains/userProjectRole/service';
import { ProjectDTO } from '@domains/project/dto';
import { RoleDTO } from '@domains/role/dto';
import { UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { createMockContext, type MockContext } from '@context';
import { type PrismaClient } from '@prisma/client';
import { NotFoundException } from '@utils';

let userMockRepository: UserRepository;
let roleMockRepository: RoleRepository;
let UPRMockRepository: UserProjectRoleRepository;
let projectMockRepository: ProjectRepository;
let service: UserProjectRoleService;
let user: UserDTO;
let project: ProjectDTO;
let role: RoleDTO;
let userProjectRole: UserProjectRoleDTO;
let prismaMockCtx: MockContext;
let prismaMock: PrismaClient;

beforeEach(() => {
  prismaMockCtx = createMockContext();
  prismaMock = prismaMockCtx.prisma;
  userMockRepository = new UserRepositoryImpl(prismaMock);
  roleMockRepository = new RoleRepositoryImpl(prismaMock);
  UPRMockRepository = new UserProjectRoleRepositoryImpl(prismaMock);
  projectMockRepository = new ProjectRepositoryImpl(prismaMock);
  service = new UserProjectRoleServiceImpl(UPRMockRepository, userMockRepository, projectMockRepository, roleMockRepository);
  user = new UserDTO({
    id: 'userId',
    cognitoId: 'cognitoId',
    email: 'mail@mail.com',
    name: 'John Doe',
    profileImage: null,
    projectsRoleAssigned: [],
    createdAt: new Date('2023-11-18T19:28:40.065Z'),
    deletedAt: null,
    emittedUserProjectRole: [],
  });
  project = new ProjectDTO({
    id: 'idP',
    providerId: 'pId',
    organizationId: 'oId',
    name: 'Tricker',
    image: 'url',
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

describe('Method create userProjectRole tests', () => {
  it('Should successfully create a userProjectRole register', async () => {
    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
    jest.spyOn(projectMockRepository, 'getById').mockResolvedValue(project);
    jest.spyOn(roleMockRepository, 'getById').mockResolvedValue(role);
    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
    jest.spyOn(UPRMockRepository, 'create').mockResolvedValue(userProjectRole);

    const expectedUserProjectRole: UserProjectRoleDTO = userProjectRole;
    const receivedUserProjectRole: UserProjectRoleDTO = await service.create({ userId: 'userId', projectId: 'idP', roleId: 'idR', userEmitterId: 'idE', isAccepted: true });

    expect.assertions(2);

    expect(receivedUserProjectRole.id).toEqual(expectedUserProjectRole.id);
    expect(receivedUserProjectRole.createdAt.toISOString()).toEqual(expectedUserProjectRole.createdAt.toISOString());
  });

  it('Should throw exception when user is null', async () => {
    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);

    expect.assertions(2);
    await expect(service.create({ userId: 'userId', projectId: 'idP', roleId: 'idR', userEmitterId: 'idE', isAccepted: true })).rejects.toThrow(NotFoundException);

    await expect(service.create({ userId: 'userId', projectId: 'idP', roleId: 'idR', userEmitterId: 'idE', isAccepted: true })).rejects.toThrow("Not found. Couldn't find User");
  });

  it('Should throw exception when role is null', async () => {
    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
    jest.spyOn(projectMockRepository, 'getById').mockResolvedValue(project);
    jest.spyOn(roleMockRepository, 'getById').mockResolvedValue(null);

    expect.assertions(2);
    await expect(service.create({ userId: 'userId', projectId: 'idP', roleId: 'idR', userEmitterId: 'idE', isAccepted: true })).rejects.toThrow(NotFoundException);
    await expect(service.create({ userId: 'userId', projectId: 'idP', roleId: 'idR', userEmitterId: 'idE', isAccepted: true })).rejects.toThrow("Not found. Couldn't find Role");
  });

  it('Should throw exception when emitter user is null', async () => {
    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(user);
    jest.spyOn(projectMockRepository, 'getById').mockResolvedValue(project);
    jest.spyOn(roleMockRepository, 'getById').mockResolvedValue(role);
    jest.spyOn(userMockRepository, 'getById').mockResolvedValue(null);

    expect.assertions(2);
    await expect(service.create({ userId: 'userId', projectId: 'idP', roleId: 'idR', userEmitterId: 'idE', isAccepted: true })).rejects.toThrow(NotFoundException);

    await expect(service.create({ userId: 'userId', projectId: 'idP', roleId: 'idR', userEmitterId: 'idE', isAccepted: true })).rejects.toThrow("Not found. Couldn't find User");
  });
});
