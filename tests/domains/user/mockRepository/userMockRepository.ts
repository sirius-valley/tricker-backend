import { type SignupInputDTO } from '@domains/auth';
import { UserDTO, type UserModel, type UserRepository } from '@domains/user';

export class UserMockRepository implements UserRepository {
  async create(data: SignupInputDTO): Promise<UserModel> {
    return { id: '', password: '' };
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<UserModel | null> {
    return null;
  }

  async getById(id: string): Promise<UserDTO | null> {
    if (id === 'idNull') {
      return null;
    }
    return new UserDTO({
      id: 'id',
      profileImage: null,
      projectsRoleAssigned: [],
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
      emittedUserProjectRole: [],
    });
  }
}
