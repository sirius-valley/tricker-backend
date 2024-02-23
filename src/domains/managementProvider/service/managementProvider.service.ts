import type { ManagementProviderDTO } from '@domains/managementProvider/dto';

export interface ManagementProviderService {
  getByName: (name: string) => Promise<ManagementProviderDTO>;
}
