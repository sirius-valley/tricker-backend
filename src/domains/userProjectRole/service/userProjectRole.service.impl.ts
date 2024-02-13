import { type UserProjectRoleService } from '@domains/userProjectRole/service/userProjectRole.service';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type RoleRepository } from '@domains/role/repository';
import { ConflictException } from '@utils';

export class UserProjectRoleServiceImpl implements UserProjectRoleService {
  constructor(
    private readonly userProjectRoleRepository: UserProjectRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async create(userId: string, projectId: string, roleId: string, userEmitterId: string): Promise<UserProjectRoleDTO> {
    const user = await this.userRepository.getById(userId);
    if (user == null) throw new ConflictException('User id is not correct');
    const project = await this.projectRepository.getById(projectId);
    if (project == null) throw new ConflictException('Project id is not correct');
    const role = await this.roleRepository.getById(roleId);
    if (role == null) throw new ConflictException('Role id is not correct');
    const userEmitter = await this.userRepository.getById(userEmitterId);
    if (userEmitter == null) throw new ConflictException('Emitter id is not correct');

    return await this.userProjectRoleRepository.create(userId, projectId, roleId, userEmitterId);
  }
}
