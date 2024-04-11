import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type ProjectBasicDTO, type ProjectsFilterInput } from '@domains/project/dto';
import { type UserProject } from '@domains/issue';

export interface ProjectService {
  getDevProjectFilters: (input: UserProject) => Promise<DevProjectFiltersDTO>;
  getPMProjectFilters: (projectId: string) => Promise<PMProjectFiltersDTO>;
  getProjectsListByUserIdFiltered: (input: ProjectsFilterInput) => Promise<ProjectBasicDTO[]>;
}
