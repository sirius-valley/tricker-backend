import { type PendingAuthProjectRepository } from '@domains/pendingAuthProject/repository/pendingAuthProject.repository';
import { type PendingAuthProjectDTO } from '@domains/pendingAuthProject/dto';
import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class PendingAuthProjectRepositoryImpl implements PendingAuthProjectRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(providerProjectId: string, projectToken: string, memberMails: string[], providerId: string, integratorId: string): Promise<PendingAuthProjectDTO | null> {
    /* const pendingProject = await this.db.pendingAuthProject.create({
            data: {
                providerProjectId,
                projectToken,
                providerId,
                integratorId,
                memberMails
            }
        })

        return pendingProject === null ? null: new PendingAuthProjectDTO(pendingProject); */
    return null;
  }

  async getByProjectId(providerProjectId: string): Promise<PendingAuthProjectDTO | null> {
    /* const pendingProject = await this.db.pendingAuthProject.findUnique({
            where: {
                providerProjectId
            }
        })
        
        return pendingProject === null ? null: new PendingAuthProjectDTO(pendingProject); */
    return null;
  }
}
