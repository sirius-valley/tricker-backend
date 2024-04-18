import { type IssueProviderService } from '@domains/issueProvider/service/issueProvider.service';
import { type IssueProviderDTO } from '@domains/issueProvider/dto';
import { type IssueProviderRepository } from '@domains/issueProvider/repository';
import { NotFoundException } from '@utils';

export class IssueProviderServiceImpl implements IssueProviderService {
  constructor(private readonly issueProviderRepository: IssueProviderRepository) {}

  /**
   * Retrieves an issue provider by name.
   *
   * @param {string} name - The name of the issue provider to retrieve.
   * @returns {Promise<IssueProviderDTO>} - A promise that resolves with the issue provider DTO.
   * @throws {NotFoundException} - If the issue provider with the given name is not found.
   */
  async getByName(name: string): Promise<IssueProviderDTO> {
    const provider: IssueProviderDTO | null = await this.issueProviderRepository.getByName(name);
    if (provider === null) {
      throw new NotFoundException('Issue Provider');
    }

    return provider;
  }

  /**
   * Retrieves all issue providers.
   *
   * @returns {Promise<IssueProviderDTO[]>} - A promise that resolves with an array of issue provider DTOs.
   */
  async getAll(): Promise<IssueProviderDTO[]> {
    return await this.issueProviderRepository.getAll();
  }
}
