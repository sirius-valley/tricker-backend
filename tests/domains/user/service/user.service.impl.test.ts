import { UserDTO } from '@domains/user';
import { type UserService, UserServiceImpl } from '@domains/user/service';
import { NotFoundException } from '@utils';
import { projectRepositoryMock, roleRepositoryMock, userProjectRoleRepositoryMock, userRepositoryMock } from '../../mock/mock';
import { mockDevRoleDTO, mockProjectDTO, mockUserDTO, mockUserProjectRoleDTO, mockUserProjectRolePMDTO } from '../../issue/mockData';
import type { UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { mockUserProjectRoleUpdateInput } from '../../project/mockData';

let service: UserService;
let user: UserDTO;

beforeEach(() => {
  service = new UserServiceImpl(userRepositoryMock, projectRepositoryMock, roleRepositoryMock, userProjectRoleRepositoryMock);
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

  jest.resetAllMocks();
});

describe('user service tests', () => {
  it('Should successfully get a user by a provided id', async () => {
    userRepositoryMock.getByCognitoId.mockResolvedValue(user);
    const receivedUser: UserDTO = await service.getByProviderUserId('id');

    expect.assertions(2);

    expect(receivedUser.id).toEqual(user.id);
    expect(receivedUser.createdAt.toISOString()).toEqual(user.createdAt.toISOString());
  });

  it('Should throw exception when user is null', async () => {
    userRepositoryMock.getByCognitoId.mockResolvedValue(null);

    expect.assertions(2);

    await expect(service.getByProviderUserId('id')).rejects.toThrow(NotFoundException);
    await expect(service.getByProviderUserId('id')).rejects.toThrow("Not found. Couldn't find User");
  });

  describe('updateUserRoleForAProject method', () => {
    it('should successfully update a user role for a project', async (): Promise<void> => {
      // given
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      roleRepositoryMock.getById.mockResolvedValue(mockDevRoleDTO);
      userProjectRoleRepositoryMock.getByProjectIdAndUserId.mockResolvedValue(mockUserProjectRoleDTO);
      userProjectRoleRepositoryMock.update.mockResolvedValue(mockUserProjectRolePMDTO);
      const expected: UserProjectRoleDTO = mockUserProjectRolePMDTO;
      // when
      const received: UserProjectRoleDTO = await service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput);
      // then
      expect.assertions(3);
      expect(expected.id).toEqual(received.id);
      expect(expected.roleId).toEqual(received.roleId);
      expect(expected.projectId).toEqual(received.projectId);
    });

    it('Should throw exception when emitter is null', async () => {
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      roleRepositoryMock.getById.mockResolvedValue(mockDevRoleDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue(null);

      expect.assertions(2);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow(NotFoundException);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow("Not found. Couldn't find User");
    });

    it('Should throw exception when role is null', async () => {
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      roleRepositoryMock.getById.mockResolvedValue(null);

      expect.assertions(2);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow(NotFoundException);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow("Not found. Couldn't find Role");
    });

    it('Should throw exception when project is null', async () => {
      projectRepositoryMock.getById.mockResolvedValue(null);

      expect.assertions(2);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow(NotFoundException);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow("Not found. Couldn't find Project");
    });

    it('Should throw exception when user is null', async () => {
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      roleRepositoryMock.getById.mockResolvedValue(mockDevRoleDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      userRepositoryMock.getById.mockResolvedValue({ ...mockUserDTO, deletedAt: new Date() });

      expect.assertions(2);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow(NotFoundException);
      await expect(service.updateUserRoleForAProject(mockUserProjectRoleUpdateInput)).rejects.toThrow("Not found. Couldn't find User");
    });
  });
});
