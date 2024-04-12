import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type MyProjectViewDTO } from '@domains/project/dto';
import { type UserProject } from '@domains/issue';

export interface ProjectService {
  getDevProjectFilters: (input: UserProject) => Promise<DevProjectFiltersDTO>;
  getPMProjectFilters: (projectId: string) => Promise<PMProjectFiltersDTO>;
  getMyProjectView: (input: { cognitoId: string; projectId: string }) => Promise<MyProjectViewDTO>;
  deleteProject: (input: { cognitoId: string; projectId: string }) => Promise<string>;
}
