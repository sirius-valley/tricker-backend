import { type AuthorizationRequestDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface IntegrationRepository {
  createIntegrationProjectRequest: (request: AuthorizationRequestDTO) => Promise<PendingProjectAuthorizationDTO>;
}
