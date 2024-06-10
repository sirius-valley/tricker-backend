import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { UserProjectRoleDTO, type UserProjectRoleInput, type UserProjectRoleUpdateExtended, UserRoleDTO } from '@domains/userProjectRole/dto';
import { type PrismaClient, type UserProjectRole } from '@prisma/client';
import { type UserProject } from '@domains/issue/dto';

export class UserProjectRoleRepositoryImpl implements UserProjectRoleRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(input: UserProjectRoleInput): Promise<UserProjectRoleDTO> {
    const userProjectRole = await this.db.userProjectRole.create({
      data: {
        userId: input.userId,
        projectId: input.projectId,
        roleId: input.roleId,
        userEmitterId: input.userEmitterId,
        isAccepted: input.isAccepted,
      },
    });

    return new UserProjectRoleDTO(userProjectRole);
  }

  /**
   * Retrieves a user-project role relationship by project ID and user ID.
   * @param input Object containing project ID and user ID.
   * @returns A Promise resolving to a UserProjectRoleDTO object or null if not found.
   */
  async getByProjectIdAndUserId(input: UserProject): Promise<UserProjectRoleDTO | null> {
    const userProjectRole: UserProjectRole | null = await this.db.userProjectRole.findFirst({
      where: {
        projectId: input.projectId,
        userId: input.userId,
        deletedAt: null,
      },
    });

    return userProjectRole === null ? null : new UserProjectRoleDTO(userProjectRole);
  }

  /**
   * Updates a user-project role relationship by ID.
   * @param input Object containing data to update a userProjectRole.
   * @returns A Promise resolving to a UserProjectRoleDTO object.
   */
  async update(input: UserProjectRoleUpdateExtended): Promise<UserProjectRoleDTO> {
    const userProjectRole = await this.db.userProjectRole.update({
      where: {
        id: input.id,
        deletedAt: null,
      },
      data: {
        roleId: input.roleId,
        isAccepted: input.isAccepted,
        userEmitterId: input.userEmitterId,
      },
    });

    return new UserProjectRoleDTO(userProjectRole);
  }

  /**
   * Retrieves user project roles based on user ID or project ID (or both).
   *
   * @param {object} input - An object containing optional user ID and project ID properties.
   * @param {string} [input.userId] - ID of the user to retrieve project roles for.
   * @param {string} [input.projectId] - ID of the project to retrieve user roles for.
   * @returns {Promise<UserRoleDTO[]>} - Promise resolving to an array of ExtendedUserProjectRoleDTO objects representing the user's project roles.
   */
  async getUserRolesByUserAndOrProject({ userId, projectId }: { userId?: string; projectId?: string }): Promise<UserRoleDTO[]> {
    const res = await this.db.userProjectRole.findMany({
      where: {
        userId,
        projectId,
        deletedAt: null,
        isAccepted: true,
      },
      include: {
        user: true,
        role: true,
        project: true,
      },
    });

    return res.map((userProjectRole) => new UserRoleDTO(userProjectRole));
  }
}
