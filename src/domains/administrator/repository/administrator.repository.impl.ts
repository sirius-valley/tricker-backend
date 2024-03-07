import { type AdministratorRepository } from '@domains/administrator/repository/administrator.repository';
import { AdministratorDTO } from '../dto';
import { type PrismaClient } from '@prisma/client';

export class AdministratorRepositoryImpl implements AdministratorRepository {
  constructor(private readonly db: PrismaClient) {}

  async getByOrganizationName(orgName: string): Promise<AdministratorDTO[]> {
    const admins = await this.db.organizationAdministrator.findMany({
      where: {
        organization: {
          name: orgName,
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

    return admins.map(
      (admin) =>
        new AdministratorDTO({
          id: admin.id,
          email: admin.user.email,
        })
    );
  }

  async getByOrganizationId(orgId: string): Promise<AdministratorDTO[]> {
    const admins = await this.db.organizationAdministrator.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return admins.map(
      (admin) =>
        new AdministratorDTO({
          id: admin.id,
          email: admin.user.email,
        })
    );
  }
}
