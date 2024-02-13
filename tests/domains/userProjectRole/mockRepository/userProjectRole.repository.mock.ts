import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';

export class UserProjectRoleRepositoryMock implements UserProjectRoleRepository {
  async create(userId: string, projectId: string, roleId: string, userEmitterId: string): Promise<UserProjectRoleDTO> {
    await Promise.resolve(undefined);
  }
}
