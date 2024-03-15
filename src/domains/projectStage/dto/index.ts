import { type StageType } from '@domains/stage/dto';

export class ProjectStageDTO {
  id: string;
  projectId: string;
  stageId: string;
  type: StageType;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(projectStage: ProjectStageDTO) {
    this.id = projectStage.id;
    this.projectId = projectStage.projectId;
    this.stageId = projectStage.stageId;
    this.type = projectStage.type;
    this.createdAt = projectStage.createdAt;
    this.deletedAt = projectStage.deletedAt;
  }
}

/**
 * Interface representing input data for creating a project stage in ProjectStage repository.
 */
export interface ProjectStageCreationInput {
  projectId: string;
  stageId: string;
  type: StageType;
}
