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
    const userPrisma = await this.db.user.findUnique({
      where: {
        id,
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

  /**
   * Creates a new user without a Cognito ID.
   * @param {string} email - The email address of the user.
   * @param {string} name - The name of the user.
   * @returns {Promise<UserDTO>} A promise that resolves with the created user DTO.
   */
  async createWithoutCognitoId(email: string, name: string): Promise<UserDTO> {
    const user: User = await this.db.user.create({
      data: {
        email,
        name,
      },
    });
    return new UserDTO({ ...user, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }

  /**
   * Retrieves a user by their Cognito ID.
   * @param cognitoId - The Cognito ID of the user.
   * @returns A Promise that resolves to a UserDTO object if the user is found, or null if not found.
   */
  async getByCognitoId(cognitoId: string): Promise<UserDTO | null> {
    const user: User | null = await this.db.user.findUnique({
      where: {
        cognitoId,
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

    return user === null ? null : new UserDTO({ ...user, emittedUserProjectRole: [], projectsRoleAssigned: [] });
  }
}
