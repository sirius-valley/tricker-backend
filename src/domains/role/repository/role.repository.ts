import type { RoleDTO } from '@domains/role/dto';

export interface RoleRepository {
  getById: (roleId: string) => Promise<null | RoleDTO>;
  getByName: (name: string) => Promise<null | RoleDTO>;
  create: (name: string) => Promise<RoleDTO>;
}
