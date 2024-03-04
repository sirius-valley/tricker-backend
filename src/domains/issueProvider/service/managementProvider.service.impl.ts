import { type ManagementProviderService } from '@domains/issueProvider/service/managementProvider.service';
import { type IssueProviderDTO } from '@domains/issueProvider/dto';
import { type IssueProviderRepository } from '@domains/issueProvider/repository';
import { NotFoundException } from '@utils';

export class ManagementProviderServiceImpl implements ManagementProviderService {
  constructor(private readonly managementProviderRepository: IssueProviderRepository) {}

  async getByName(name: string): Promise<IssueProviderDTO> {
    const provider: IssueProviderDTO | null = await this.managementProviderRepository.getByName(name);
    if (provider === null) {
      throw new NotFoundException('Management Provider');
    }

    return provider;
  }
}
