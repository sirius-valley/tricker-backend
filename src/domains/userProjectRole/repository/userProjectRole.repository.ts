import { type UserProjectRoleDTO, type UserProjectRoleInputDTO } from '@domains/userProjectRole/dto';

export interface UserProjectRoleRepository {
  create: (input: UserProjectRoleInputDTO) => Promise<UserProjectRoleDTO>;
}
