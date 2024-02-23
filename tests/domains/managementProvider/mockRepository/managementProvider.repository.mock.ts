import { type ManagementProviderRepository } from '@domains/managementProvider/repository';
import { type ManagementProviderDTO } from '@domains/managementProvider/dto';

export class ManagementProviderRepositoryMock implements ManagementProviderRepository {
  async getByName(name: string): Promise<ManagementProviderDTO | null> {
    return null;
  }
}
