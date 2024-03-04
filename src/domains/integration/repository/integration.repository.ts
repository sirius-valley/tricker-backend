import { type AuthorizationRequest } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export interface IntegrationRepository {
  createIntegrationProjectRequest: (request: AuthorizationRequest) => Promise<PendingProjectAuthorizationDTO>;
}
