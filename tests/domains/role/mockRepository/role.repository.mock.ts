import { type RoleRepository } from '@domains/role/repository';
import { RoleDTO } from '@domains/role/dto';

export class RoleRepositoryMock implements RoleRepository {
  async create(name: string): Promise<RoleDTO> {
    return new RoleDTO({ id: '1', name: 'Project Manager' });
  }

  async getById(roleId: string): Promise<RoleDTO | null> {
    if (roleId == null) return null;
    if (roleId === '2') return new RoleDTO({ id: '1', name: 'Developer' });
    return new RoleDTO({ id: '1', name: 'Project Manager' });
  }

  async getByName(name: string): Promise<RoleDTO | null> {
    return null;
  }
}
