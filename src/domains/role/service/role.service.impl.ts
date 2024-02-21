import { type RoleService } from '@domains/role/service/role.service';
import { type RoleDTO } from '@domains/role/dto';
import { type RoleRepository } from '@domains/role/repository';

export class RoleServiceImpl implements RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getOrCreate(name: string): Promise<RoleDTO> {
    let role: RoleDTO | null = await this.roleRepository.getByName(name);
    if (role === null) {
      role = await this.roleRepository.create(name);
    }

    return role;
  }
}
