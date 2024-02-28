import { PendingMemberMailDTO } from '@domains/pendingMemberMail/dto';
import { type PendingMemberMailsRepository } from '@domains/pendingMemberMail/repository/pendingMemberMails.repository';
import type { MemberEmail, PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class PendingMemberMailsRepositoryImpl implements PendingMemberMailsRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async getByProjectId(projectId: string): Promise<PendingMemberMailDTO[]> {
    console.log(projectId);
    const memberMails: MemberEmail[] = await this.db.memberEmail.findMany({
      where: {
        pendingProjectAuthorizationId: projectId,
      },
    });

    return memberMails.map((memberMail) => new PendingMemberMailDTO(memberMail));
  }
}
