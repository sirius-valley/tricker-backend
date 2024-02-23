import { type ProjectDTO, type ProjectPreIntegratedDTO } from '@domains/project/dto';

export interface ProjectService {
  retrieveProjectsFromProvider: (providerName: string, secret?: string) => Promise<ProjectPreIntegratedDTO[]>;
  integrateProject: (projectId: string, userId: string) => Promise<ProjectDTO>;
}
