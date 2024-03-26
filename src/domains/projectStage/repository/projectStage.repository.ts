import { type ProjectStageCreationInput, type ProjectStageDTO } from '@domains/projectStage/dto';

export interface ProjectStageRepository {
  create: (input: ProjectStageCreationInput) => Promise<ProjectStageDTO>;
  getById: (id: string) => Promise<ProjectStageDTO | null>;
  getByProjectIdAndName: (input: { projectId: string; name: string }) => Promise<ProjectStageDTO | null>;
}
