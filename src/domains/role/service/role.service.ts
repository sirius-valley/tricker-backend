import { type RoleDTO } from '@domains/role/dto';

export interface RoleService {
  getOrCreate: (name: string) => Promise<RoleDTO>;
}
