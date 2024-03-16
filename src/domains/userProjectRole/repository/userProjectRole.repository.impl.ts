import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { UserProjectRoleDTO, type UserProjectRoleInputDTO } from '@domains/userProjectRole/dto';
import { type PrismaClient, type UserProjectRole } from '@prisma/client';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';

export class UserProjectRoleRepositoryImpl implements UserProjectRoleRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(input: UserProjectRoleInputDTO): Promise<UserProjectRoleDTO> {
    const userProjectRole = await this.db.userProjectRole.create({
      data: {
        userId: input.userId,
        projectId: input.projectId,
        roleId: input.roleId,
        userEmitterId: input.userEmitterId,
      },
    });

    return new UserProjectRoleDTO(userProjectRole);
  }

  async getByProjectIdAndUserId(projectId: string, userId: string): Promise<UserProjectRoleDTO | null> {
    const userProjectRole: UserProjectRole | null = await this.db.userProjectRole.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    return userProjectRole === null ? null : new UserProjectRoleDTO(userProjectRole);
  }
}
