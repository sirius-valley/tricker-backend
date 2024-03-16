import { type UserProjectRoleDTO, type UserProjectRoleInputDTO } from '@domains/userProjectRole/dto';

export interface UserProjectRoleRepository {
  create: (input: UserProjectRoleInputDTO) => Promise<UserProjectRoleDTO>;
  getByProjectIdAndUserId: (projectId: string, userId: string) => Promise<UserProjectRoleDTO | null>;
}
