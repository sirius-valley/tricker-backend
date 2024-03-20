import { type ProjectStageCreationInput, type ProjectStageDTO } from '@domains/projectStage/dto';

export interface ProjectStageRepository {
  create: (input: ProjectStageCreationInput) => Promise<ProjectStageDTO>;
  getByProjectIdAndStageId: (input: { projectId: string; stageId: string }) => Promise<ProjectStageDTO | null>;
}
