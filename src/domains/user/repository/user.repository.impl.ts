import { type PrismaClient } from '@prisma/client';
import { type CreateUserIdTokenDTO, UserDTO } from '../dto';
import { type UserRepository } from './user.repository';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: CreateUserIdTokenDTO): Promise<UserDTO> {
    const user = await this.db.user.create({
      data: {
        cognitoId: data.providerId,
        email: data.email,
        name: data.name,
      },
    });
    return new UserDTO({ ...user, emittedUserProjectRole: [], projectsRoleAssigned: [] });
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

  async getByProviderId(providerId: string): Promise<UserDTO | null> {
    const userPrisma = await this.db.user.findUnique({
      where: {
        cognitoId: providerId,
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
