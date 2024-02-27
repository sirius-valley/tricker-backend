import { type OrganizationDTO } from '@domains/organization/dto';

export interface OrganizationRepository {
  getByName: (name: string) => Promise<OrganizationDTO | null>;
}
