import { type ManagementProviderService } from '@domains/managementProvider/service/managementProvider.service';
import { type ManagementProviderDTO } from '@domains/managementProvider/dto';
import { type ManagementProviderRepository } from '@domains/managementProvider/repository';
import { NotFoundException } from '@utils';

export class ManagementProviderServiceImpl implements ManagementProviderService {
  constructor(private readonly managementProviderRepository: ManagementProviderRepository) {}

  async getByName(name: string): Promise<ManagementProviderDTO> {
    const provider: ManagementProviderDTO | null = await this.managementProviderRepository.getByName(name);
    if (provider === null) {
      throw new NotFoundException('Management Provider');
    }

    return provider;
  }
}
