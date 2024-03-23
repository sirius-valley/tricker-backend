import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { UserProjectRoleDTO, type UserProjectRoleInputDTO } from '@domains/userProjectRole/dto';
import { type PrismaClient, type UserProjectRole } from '@prisma/client';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';
import { type UserProject } from '@domains/issue/dto';

export class UserProjectRoleRepositoryImpl implements UserProjectRoleRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(input: UserProjectRoleInputDTO): Promise<UserProjectRoleDTO> {
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
      },
    });

    return userProjectRole === null ? null : new UserProjectRoleDTO(userProjectRole);
  }
}
