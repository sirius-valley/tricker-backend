import { type PrismaClient, type User } from '@prisma/client';
import { type CreateUserIdTokenDTO, UserDTO, type UserUpdateInputDTO } from '../dto';
import { type UserRepository } from '@domains/user';
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

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
          include: {
            project: true,
            role: true,
          },
        },
        emittedUserProjectRole: {
          where: {
            deletedAt: null,
          },
          include: {
            project: true,
            role: true,
          },
        },
      },
    });

    return userPrisma === null ? null : new UserDTO(userPrisma);
  }

  async getByCognitoId(cognitoId: string): Promise<UserDTO | null> {
    const userPrisma = await this.db.user.findUnique({
      where: {
        cognitoId,
        deletedAt: null,
      },
      include: {
        projectsRoleAssigned: {
          where: {
            deletedAt: null,
          },
          include: {
            project: true,
            role: true,
          },
        },
        emittedUserProjectRole: {
          where: {
            deletedAt: null,
          },
          include: {
            project: true,
            role: true,
          },
        },
      },
    });

    return userPrisma === null ? null : new UserDTO(userPrisma);
  }

  async getByEmail(email: string): Promise<UserDTO | null> {
    const userPrisma = await this.db.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: {
        projectsRoleAssigned: {
          where: {
            deletedAt: null,
          },
          include: {
            project: true,
            role: true,
          },
        },
        emittedUserProjectRole: {
          where: {
            deletedAt: null,
          },
          include: {
            project: true,
            role: true,
          },
        },
      },
    });

    return userPrisma === null ? null : new UserDTO(userPrisma);
  }

  async update(input: UserUpdateInputDTO): Promise<UserDTO | null> {
    const userPrisma = await this.db.user.update({
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
          include: {
            project: true,
            role: true,
          },
        },
        emittedUserProjectRole: {
          where: {
            deletedAt: null,
          },
          include: {
            project: true,
            role: true,
          },
        },
      },
    });

    return userPrisma === null ? null : new UserDTO(userPrisma);
  }
}
