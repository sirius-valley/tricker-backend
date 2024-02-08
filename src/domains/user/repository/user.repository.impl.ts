import { type SignupInputDTO } from '@domains/auth';
import { type PrismaClient } from '@prisma/client';
import { type UserModel, UserDTO } from '../dto';
import { type UserRepository } from './user.repository';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: SignupInputDTO): Promise<UserModel> {
    return { id: '', password: '' };
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<UserModel | null> {
    return null;
  }

  async getById(id: string): Promise<UserDTO | null> {
    const userPrisma = await this.db.user.findUnique({
      where: {
        id,
      },
      include: {
        projectsRoleAssigned: {
          where: {
            deletedAt: null,
          },
        },
        emittedUserProjectRole: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    return userPrisma === null ? null : new UserDTO(userPrisma);
  }
}
