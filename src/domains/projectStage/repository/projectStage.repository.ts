import { type ProjectStageDTO } from '@domains/projectStage/dto';

export interface ProjectStageRepository {
  create: (projectId: string, stageId: string) => Promise<ProjectStageDTO>;
}
