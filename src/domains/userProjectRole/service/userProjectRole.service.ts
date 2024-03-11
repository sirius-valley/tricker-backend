import { type UserProjectRoleDTO, type UserProjectRoleInputDTO } from '@domains/userProjectRole/dto';

export interface UserProjectRoleService {
  create: (input: UserProjectRoleInputDTO) => Promise<UserProjectRoleDTO>;
}
