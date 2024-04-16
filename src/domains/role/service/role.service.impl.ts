import { type RoleService } from '@domains/role/service/role.service';
import { type RoleDTO } from '@domains/role/dto';
import { type RoleRepository } from '@domains/role/repository';

export class RoleServiceImpl implements RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * Retrieves roles from a repository.
   * @returns A Promise that resolves with an array of RoleDTO objects representing the retrieved roles.
   */
  async getRoles(): Promise<RoleDTO[]> {
    return this.roleRepository.getRoles();
  }
}
