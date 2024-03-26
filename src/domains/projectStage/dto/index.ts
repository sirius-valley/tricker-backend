export class StageDTO {
  id: string;
  name: string;

  constructor(stage: StageDTO) {
    this.id = stage.id;
    this.name = stage.name;
  }
}

export type StageType = 'BACKLOG' | 'UNSTARTED' | 'STARTED' | 'COMPLETED' | 'CANCELED' | 'OTHER';

/**
 * Represents a data transfer object (DTO) for an extended stage.
 * This DTO contains information about a stage, including its ID, name, and type. It adds StageType to StageDTO
 */
export class StageExtendedDTO extends StageDTO {
  /**
   * The type of the stage.
   */
  type: StageType;

  constructor(stage: StageExtendedDTO) {
    super(stage);
    this.type = stage.type;
  }
}

export class ProjectStageDTO {
  id: string;
  projectId: string;
  name: string;
  type: StageType;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(projectStage: ProjectStageDTO) {
    this.id = projectStage.id;
    this.projectId = projectStage.projectId;
    this.name = projectStage.name;
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
  name: string;
  type: StageType;
}
