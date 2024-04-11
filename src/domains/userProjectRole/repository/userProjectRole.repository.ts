import { type UserRoleDTO, type UserProjectRoleDTO, type UserProjectRoleInputDTO } from '@domains/userProjectRole/dto';
import { type UserProject } from '@domains/issue/dto';

export interface UserProjectRoleRepository {
  create: (input: UserProjectRoleInputDTO) => Promise<UserProjectRoleDTO>;
  getByProjectIdAndUserId: (input: UserProject) => Promise<UserProjectRoleDTO | null>;
  getUserRolesByUserAndOrProject: (input: { userId?: string; projectId?: string }) => Promise<UserRoleDTO[]>;
}
