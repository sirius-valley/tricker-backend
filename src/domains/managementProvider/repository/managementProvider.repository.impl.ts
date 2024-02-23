import { type ManagementProviderRepository } from '@domains/managementProvider/repository/managementProvider.repository';
import { type ManagementProviderDTO } from '@domains/managementProvider/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class ManagementProviderRepositoryImpl implements ManagementProviderRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async getByName(name: string): Promise<ManagementProviderDTO | null> {
    /* const provider = await this.db.managementProvider.findUnique({
            data: {
                name
            }
        });


        return provider === null ? null: new ManagementProviderDTO(provider); */
    return null;
  }
}
