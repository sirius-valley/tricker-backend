import { type DevProjectFiltersDTO, type MyProjectViewDTO, type PMProjectFiltersDTO, type ProjectBasicDTO, type ProjectsFilterInput } from '@domains/project/dto';
import { type UserProject } from '@domains/issue';

export interface ProjectService {
  getDevProjectFilters: (input: UserProject) => Promise<DevProjectFiltersDTO>;
  getPMProjectFilters: (projectId: string) => Promise<PMProjectFiltersDTO>;
  getMyProjectView: (input: { cognitoId: string; projectId: string }) => Promise<MyProjectViewDTO>;
  deleteProject: (input: { cognitoId: string; projectId: string }) => Promise<string>;
  getProjectsListByUserIdFiltered: (input: ProjectsFilterInput) => Promise<ProjectBasicDTO[]>;
  deleteMember: (input: { cognitoId: string; userId: string; projectId: string }) => Promise<void>;
}
