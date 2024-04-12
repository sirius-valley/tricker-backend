import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type ProjectBasicDTO, type ProjectsFilterInput, type MyProjectViewDTO } from '@domains/project/dto';
import { type UserProject } from '@domains/issue';

export interface ProjectService {
  getDevProjectFilters: (input: UserProject) => Promise<DevProjectFiltersDTO>;
  getPMProjectFilters: (projectId: string) => Promise<PMProjectFiltersDTO>;
  getMyProjectView: (input: { userId: string; projectId: string }) => Promise<MyProjectViewDTO>;
  getProjectsListByUserIdFiltered: (input: ProjectsFilterInput) => Promise<ProjectBasicDTO[]>;
}
