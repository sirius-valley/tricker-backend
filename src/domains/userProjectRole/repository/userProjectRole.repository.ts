import { type UserProjectRoleDTO, type UserProjectRoleInput, type UserProjectRoleUpdateExtended } from '@domains/userProjectRole/dto';
import { type UserProject } from '@domains/issue/dto';

export interface UserProjectRoleRepository {
  create: (input: UserProjectRoleInput) => Promise<UserProjectRoleDTO>;
  getByProjectIdAndUserId: (input: UserProject) => Promise<UserProjectRoleDTO | null>;
  update: (input: UserProjectRoleUpdateExtended) => Promise<UserProjectRoleDTO>;
}
