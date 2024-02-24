import { type PendingAuthProjectDTO } from '@domains/pendingAuthProject/dto';

export interface PendingAuthProjectRepository {
  create: (providerProjectId: string, projectToken: string, memberMails: string[], providerId: string, integratorId: string) => Promise<PendingAuthProjectDTO | null>;
  getByProjectId: (providerProjectId: string) => Promise<PendingAuthProjectDTO | null>;
}
