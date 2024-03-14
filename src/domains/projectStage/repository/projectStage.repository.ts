import { type ProjectStageCreationInput, type ProjectStageDTO } from '@domains/projectStage/dto';

export interface ProjectStageRepository {
  create: (input: ProjectStageCreationInput) => Promise<ProjectStageDTO>;
}
