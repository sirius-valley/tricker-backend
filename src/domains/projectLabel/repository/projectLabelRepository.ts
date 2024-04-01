import { type ProjectLabelDTO } from '@domains/projectLabel/dto';

export interface ProjectLabelRepository {
  create: ({ name, projectId }: { name: string; projectId: string }) => Promise<ProjectLabelDTO>;
  getByNameAndProjectId: ({ name, projectId }: { name: string; projectId: string }) => Promise<ProjectLabelDTO | null>;
}
