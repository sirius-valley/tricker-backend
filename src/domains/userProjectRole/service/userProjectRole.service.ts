import { type UserProjectRoleDTO, type UserProjectRoleInput } from '@domains/userProjectRole/dto';

export interface UserProjectRoleService {
  create: (input: UserProjectRoleInput) => Promise<UserProjectRoleDTO>;
}
