import { type UserProjectRoleService } from '@domains/userProjectRole/service/userProjectRole.service';
import { type UserProjectRoleDTO, type UserProjectRoleInputDTO } from '@domains/userProjectRole/dto';
import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type RoleRepository } from '@domains/role/repository';
import { NotFoundException } from '@utils';

export class UserProjectRoleServiceImpl implements UserProjectRoleService {
  constructor(
    private readonly userProjectRoleRepository: UserProjectRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async create(input: UserProjectRoleInputDTO): Promise<UserProjectRoleDTO> {
    const user = await this.userRepository.getById(input.userId);
    if (user == null || user.deletedAt !== null) throw new NotFoundException('User');
    const project = await this.projectRepository.getById(input.projectId);
    if (project == null || project.deletedAt !== null) throw new NotFoundException('Project');
    const role = await this.roleRepository.getById(input.roleId);
    if (role == null) throw new NotFoundException('Role');
    const userEmitter = await this.userRepository.getById(input.userEmitterId);
    if (userEmitter == null || userEmitter.deletedAt !== null) throw new NotFoundException('User');

    return await this.userProjectRoleRepository.create(input);
  }
}
