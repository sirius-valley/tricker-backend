import { type AuthorizationRequestDTO } from '@domains/integration/dto';
import { type PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import { type ProjectCreationInput, type ProjectDTO } from '@domains/project/dto';

export interface IntegrationRepository {
  createIntegrationProjectRequest: (request: AuthorizationRequestDTO) => Promise<PendingProjectAuthorizationDTO>;
  createIntegratedProject: (input: ProjectCreationInput) => Promise<ProjectDTO>;
}
