import { type PendingUserDTO } from '@domains/pendingUser/dto';

export interface PendingUserRepository {
  create: (email: string, projectId: string) => Promise<PendingUserDTO>;
  getByEmailAndProject: (email: string, projectId: string) => Promise<null | PendingUserDTO>;
}
