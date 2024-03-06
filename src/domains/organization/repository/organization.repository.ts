import { type OrganizationDTO } from '@domains/organization/dto';

export interface OrganizationRepository {
  getById: (id: string) => Promise<OrganizationDTO | null>;
  getByName: (name: string) => Promise<OrganizationDTO | null>;
}
