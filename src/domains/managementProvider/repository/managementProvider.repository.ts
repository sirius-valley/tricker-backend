import { type ManagementProviderDTO } from '@domains/managementProvider/dto';

export interface ManagementProviderRepository {
  getByName: (name: string) => Promise<ManagementProviderDTO | null>;
}
