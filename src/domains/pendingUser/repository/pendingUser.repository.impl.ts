import { type PendingUserRepository } from '@domains/pendingUser/repository';
import { PendingUserDTO } from '@domains/pendingUser/dto';
import { type PrismaClient } from '@prisma/client';

export class PendingUserRepositoryImpl implements PendingUserRepository {
  constructor(private readonly db: PrismaClient) {}

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
