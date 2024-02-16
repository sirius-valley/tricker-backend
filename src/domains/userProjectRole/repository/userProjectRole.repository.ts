import type { UserProjectRoleDTO } from '@domains/userProjectRole/dto';

export interface UserProjectRoleRepository {
  create: (userId: string, projectId: string, roleId: string, userEmitterId: string) => Promise<UserProjectRoleDTO>;
}
