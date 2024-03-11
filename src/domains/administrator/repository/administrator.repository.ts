import { type AdministratorDTO } from '@domains/administrator/dto';

export interface AdministratorRepository {
  getByOrganizationName: (name: string) => Promise<AdministratorDTO[]>;
  getByOrganizationId: (orgId: string) => Promise<AdministratorDTO[]>;
}
