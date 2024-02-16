import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';

export interface UserProjectRoleService {
  create: (userId: string, projectId: string, roleId: string, userEmitterId: string) => Promise<UserProjectRoleDTO>;
}
