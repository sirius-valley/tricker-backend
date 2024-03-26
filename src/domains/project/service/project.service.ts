import { type DevProjectFiltersDTO, type PMProjectFiltersDTO } from '@domains/project/dto';
import { type UserProject } from '@domains/issue';

export interface ProjectService {
  getDevProjectFilters: (input: UserProject) => Promise<DevProjectFiltersDTO>;
  getPMProjectFilters: (projectId: string) => Promise<PMProjectFiltersDTO>;
}
