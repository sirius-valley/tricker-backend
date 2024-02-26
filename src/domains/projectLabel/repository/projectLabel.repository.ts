import { type ProjectLabelDTO } from '@domains/projectLabel/dto';

export interface ProjectLabelRepository {
  create: (projectId: string, labelId: string) => Promise<ProjectLabelDTO>;
}
