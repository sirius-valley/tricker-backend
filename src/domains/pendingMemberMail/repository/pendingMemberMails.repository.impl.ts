import { PendingMemberMailDTO } from '@domains/pendingMemberMail/dto';
import { type PendingMemberMailsRepository } from '@domains/pendingMemberMail/repository/pendingMemberMails.repository';
import type { MemberEmail, PrismaClient } from '@prisma/client';

export class PendingMemberMailsRepositoryImpl implements PendingMemberMailsRepository {
  constructor(private readonly db: PrismaClient) {}

  async getByProjectId(projectId: string): Promise<PendingMemberMailDTO[]> {
    const memberMails: MemberEmail[] = await this.db.memberEmail.findMany({
      where: {
        pendingProjectAuthorizationId: projectId,
      },
    });

    return memberMails.map((memberMail) => new PendingMemberMailDTO(memberMail));
  }
}
