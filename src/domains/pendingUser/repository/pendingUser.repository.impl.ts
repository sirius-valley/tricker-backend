import { type PendingUserRepository } from '@domains/pendingUser/repository';
import { PendingUserDTO } from '@domains/pendingUser/dto';
import { type PrismaClient } from '@prisma/client';
import { type ITXClientDenyList } from '@prisma/client/runtime/library';

export class PendingUserRepositoryImpl implements PendingUserRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList>) {}

  async getByEmailAndProject(email: string, projectId: string): Promise<null | PendingUserDTO> {
    const pendingUser = await this.db.pendingUser.findFirst({
      where: {
        email,
        projectId,
      },
    });

    return pendingUser == null ? null : new PendingUserDTO(pendingUser);
  }

  async create(email: string, projectId: string): Promise<PendingUserDTO> {
    const pendingUser = await this.db.pendingUser.create({
      data: {
        email,
        projectId,
        status: 'PENDING',
      },
    });
    return new PendingUserDTO(pendingUser);
  }
}
