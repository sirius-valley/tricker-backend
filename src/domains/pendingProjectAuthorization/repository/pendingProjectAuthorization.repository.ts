import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface PendingProjectAuthorizationRepository {
  getByProjectId: (providerProjectId: string) => Promise<PendingProjectAuthorizationDTO | null>;
  delete: (id: string) => Promise<PendingProjectAuthorizationDTO>;
}
