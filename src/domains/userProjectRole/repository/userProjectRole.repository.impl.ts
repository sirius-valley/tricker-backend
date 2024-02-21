import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { type PrismaClient } from '@prisma/client';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';

export class UserProjectRoleRepositoryImpl implements UserProjectRoleRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(userId: string, projectId: string, roleId: string, userEmitterId: string): Promise<UserProjectRoleDTO> {
    const userProjectRole = await this.db.userProjectRole.create({
      data: {
        userId,
        projectId,
        roleId,
        userEmitterId,
      },
    });

    return new UserProjectRoleDTO(userProjectRole);
  }
}
