import { type PendingProjectAuthorizationDTO, type PendingProjectInputDTO } from '@domains/pendingProjectAuthorization/dto';

export interface PendingProjectAuthorizationRepository {
  create: (data: PendingProjectInputDTO) => Promise<PendingProjectAuthorizationDTO>;
  getByProjectId: (providerProjectId: string) => Promise<PendingProjectAuthorizationDTO | null>;
  delete: (id: string) => Promise<PendingProjectAuthorizationDTO>;
}
