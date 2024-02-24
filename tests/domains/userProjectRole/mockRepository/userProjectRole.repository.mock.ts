import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';

export class UserProjectRoleRepositoryMock implements UserProjectRoleRepository {
  async create(userId: string, projectId: string, roleId: string, userEmitterId: string): Promise<UserProjectRoleDTO> {
    return {
      id: 'idUPR',
      userId: 'userId',
      projectId: 'idP',
      roleId: 'idR',
      userEmitterId: 'idE',
      createdAt: new Date('2023-11-18T19:28:40.065Z'),
      updatedAt: new Date('2023-11-18T19:28:40.065Z'),
      deletedAt: null,
    };
  }
}
