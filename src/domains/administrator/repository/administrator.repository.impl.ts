import { type AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import type { PrismaClient } from '@prisma/client';
import { type AdministratorDTO } from '../dto';

export class AdministratorRepositoryImpl implements AdministratorRepository {
  constructor(private readonly db: PrismaClient) {}

  async getByName(name: string): Promise<AdministratorDTO[]> {
    const admins = await this.db.organizationAdministrator.findMany({
      where: {
        organization: {
          name,
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return admins.map((admin) => admin.user.email);
  }
}
