import { type ProjectPreIntegratedDTO } from '@domains/integration/dto';

export interface IntegrationService {
  retrieveProjectsFromProvider: (providerName: string, secret: string | undefined) => Promise<ProjectPreIntegratedDTO[]>;
}
