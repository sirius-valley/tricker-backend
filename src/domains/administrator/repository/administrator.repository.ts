import { type AdministratorDTO } from '@domains/administrator/dto';

export interface AdministratorRepository {
  getByName: (name: string) => Promise<AdministratorDTO[]>;
}
