import { type PrismaClient, type User } from '@prisma/client';
import { type CreateUserIdTokenDTO, UserDTO, type UserUpdateInputDTO } from '../dto';
import { type UserRepository } from '@domains/user';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(data: CreateUserIdTokenDTO): Promise<UserDTO> {
    const user: User = await this.db.user.create({
      data: {
        cognitoId: data.providerId,
        email: data.email,
        name: data.name,
      },
    });
    return new UserDTO({ ...user, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }

  async getById(id: string): Promise<UserDTO | null> {
    const userPrisma: User | null = await this.db.user.findUnique({
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

    return userPrisma === null ? null : new UserDTO({ ...userPrisma, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }

  async getByProviderId(providerId: string): Promise<UserDTO | null> {
    const userPrisma: User | null = await this.db.user.findUnique({
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

    return userPrisma === null ? null : new UserDTO({ ...userPrisma, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }

  async getByEmail(email: string): Promise<UserDTO | null> {
    const userPrisma: User | null = await this.db.user.findFirst({
      where: {
        email,
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

    return userPrisma === null ? null : new UserDTO({ ...userPrisma, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }

  async update(input: UserUpdateInputDTO): Promise<UserDTO | null> {
    const userPrisma: User | null = await this.db.user.update({
      where: {
        id: input.id,
      },
      data: {
        cognitoId: input.cognitoId,
        name: input.name,
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

    return userPrisma === null ? null : new UserDTO({ ...userPrisma, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }

  async createWithoutCognitoId(email: string): Promise<UserDTO> {
    const user: User = await this.db.user.create({
      data: {
        email,
      },
    });
    return new UserDTO({ ...user, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }
}
