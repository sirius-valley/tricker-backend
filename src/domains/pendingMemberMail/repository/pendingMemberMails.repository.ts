import { type PendingMemberMailDTO } from '@domains/pendingMemberMail/dto';

export interface PendingMemberMailsRepository {
  getByProjectId: (projectId: string) => Promise<PendingMemberMailDTO[]>;
}
