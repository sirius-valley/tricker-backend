import { type AuthorizationRequestDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type IntegratedProjectCreationInput, type ProjectDTO } from '@domains/project/dto';

export interface IntegrationRepository {
  createIntegrationProjectRequest: (request: AuthorizationRequestDTO) => Promise<PendingProjectAuthorizationDTO>;
  createIntegratedProject: (input: IntegratedProjectCreationInput) => Promise<ProjectDTO>;
}
