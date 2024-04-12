import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type ProjectBasicDTO, type ProjectsFilterInput, type MyProjectViewDTO } from '@domains/project/dto';
import { type UserProject } from '@domains/issue';

export interface GetProjectParams {
  userId: string;
  projectId: string;
}

export interface ProjectService {
  getDevProjectFilters: (input: UserProject) => Promise<DevProjectFiltersDTO>;
  getPMProjectFilters: (projectId: string) => Promise<PMProjectFiltersDTO>;
  getMyProjectView: (input: GetProjectParams) => Promise<MyProjectViewDTO>;
  getProjectsListByUserIdFiltered: (input: ProjectsFilterInput) => Promise<ProjectBasicDTO[]>;
}
