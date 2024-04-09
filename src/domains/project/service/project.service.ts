import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type ProjectViewDTO } from '@domains/project/dto';
import { type UserProject } from '@domains/issue';

export interface ProjectService {
  getDevProjectFilters: (input: UserProject) => Promise<DevProjectFiltersDTO>;
  getPMProjectFilters: (projectId: string) => Promise<PMProjectFiltersDTO>;
  getMyProjectInfo: (userId: string) => Promise<ProjectViewDTO[]>;
}
