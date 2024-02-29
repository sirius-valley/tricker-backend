import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type AuthorizationRequest } from '@domains/integration/dto';

export interface PendingProjectAuthorizationRepository {
  create: (data: AuthorizationRequest) => Promise<PendingProjectAuthorizationDTO>;
  getByProjectId: (providerProjectId: string) => Promise<PendingProjectAuthorizationDTO | null>;
  delete: (id: string) => Promise<PendingProjectAuthorizationDTO>;
}
