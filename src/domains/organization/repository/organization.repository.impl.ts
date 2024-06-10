import { type OrganizationRepository } from '@domains/organization/repository/organization.repository';
import { OrganizationDTO } from '@domains/organization/dto';
import type { Organization, PrismaClient } from '@prisma/client';

export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(private readonly db: PrismaClient) {}

  async getById(id: string): Promise<OrganizationDTO | null> {
    const organization: Organization | null = await this.db.organization.findUnique({
      where: {
        id,
      },
    });

    return organization === null ? null : new OrganizationDTO(organization);
  }

  async getByName(name: string): Promise<OrganizationDTO | null> {
    const organization: Organization | null = await this.db.organization.findUnique({
      where: {
        name,
      },
    });

    return organization === null ? null : new OrganizationDTO(organization);
  }
}
