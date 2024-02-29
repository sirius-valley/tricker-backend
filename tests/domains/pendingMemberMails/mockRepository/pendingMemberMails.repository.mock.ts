import { type PendingMemberMailsRepository } from 'domains/pendingMemberMail/repository';
import { type PendingMemberMailDTO } from 'domains/pendingMemberMail/dto';

export class PendingMemberMailsRepositoryMock implements PendingMemberMailsRepository {
  async getByProjectId(projectId: string): Promise<PendingMemberMailDTO[]> {
    return [];
  }
}
