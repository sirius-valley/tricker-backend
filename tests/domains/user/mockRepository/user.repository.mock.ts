import { type CreateUserIdTokenDTO, UserDTO, type UserModel, type UserRepository, type UserUpdateInputDTO } from '@domains/user';

export class UserRepositoryMock implements UserRepository {
  async getByEmailOrUsername(email?: string, username?: string): Promise<UserModel | null> {
    return null;
  }

  async getById(id: string): Promise<UserDTO | null> {
    if (id === 'idNull') {
      return null;
    }
    return new UserDTO({
      id: 'id',
      cognitoId: 'cognitoId',
      email: 'mail@mail.com',
      name: 'John Doe',
      profileImage: null,
      projectsRoleAssigned: [],
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
      emittedUserProjectRole: [],
    });
  }

  async create(data: CreateUserIdTokenDTO): Promise<UserDTO> {
    return new UserDTO({
      id: 'id',
      cognitoId: 'cognitoId',
      email: 'mail@mail.com',
      name: 'John Doe',
      createdAt: new Date(),
      projectsRoleAssigned: [],
      emittedUserProjectRole: [],
      deletedAt: null,
      profileImage: null,
    });
  }

  async getByProviderId(providerId: string): Promise<UserDTO | null> {
    return null;
  }

  async getByEmail(email: string): Promise<UserDTO | null> {
    return null;
  }

  async createWithoutCognitoId(email: string): Promise<UserDTO> {
    return new UserDTO({
      id: 'id',
      cognitoId: 'cognitoId',
      email: 'mail@mail.com',
      name: 'John Doe',
      createdAt: new Date(),
      projectsRoleAssigned: [],
      emittedUserProjectRole: [],
      deletedAt: null,
      profileImage: null,
    });
  }

  async registerAlreadyCreatedUser(cognitoId: string, name: string, id: string): Promise<UserDTO | null> {
    return null;
  }

  async update(input: UserUpdateInputDTO): Promise<UserDTO | null> {
    return null;
  }
}
