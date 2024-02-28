import { type OrganizationRepository } from '@domains/organization/repository';
import { type OrganizationDTO } from '@domains/organization/dto';

export class OrganizationMockRepository implements OrganizationRepository {
  async getById(name: string): Promise<OrganizationDTO | null> {
    return null;
  }
}
