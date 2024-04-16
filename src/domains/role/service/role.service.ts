import { type RoleDTO } from '@domains/role/dto';

export interface RoleService {
  getRoles: () => Promise<RoleDTO[]>;
}
