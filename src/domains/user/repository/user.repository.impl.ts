import { type PrismaClient } from '@prisma/client';
import { type UserModel, UserDTO } from '../dto';
import { type UserRepository } from '@domains/user';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(id: string, cognitoId: string, email: string, name: string, profileImage: string | null): Promise<UserDTO> {
    const user = await this.db.user.create({
      data: {
        id,
        cognitoId,
        email,
        name,
        profileImage,
      },
    });
    return new UserDTO({ ...user, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<UserModel | null> {
    return null;
  }

  async getById(id: string): Promise<UserDTO | null> {
    const userPrisma = await this.db.user.findUnique({
      where: {
        id,
        deletedAt: null,
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
