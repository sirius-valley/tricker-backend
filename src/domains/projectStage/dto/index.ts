export class StageDTO {
  id: string;
  name: string;

  constructor(stage: StageDTO) {
    this.id = stage.id;
    this.name = stage.name;
  }
}

export type StageType = 'BACKLOG' | 'UNSTARTED' | 'STARTED' | 'COMPLETED' | 'CANCELED' | 'OTHER';

export const StageTypeOrder = {
  BACKLOG: 1,
  UNSTARTED: 2,
  STARTED: 3,
  COMPLETED: 4,
  CANCELED: 5,
  OTHER: 6,
};

/**
 * Represents a data transfer object (DTO) for an extended stage.
 * This DTO contains information about a stage, including its ID, name, and type. It adds StageType to StageDTO
 */
export class StageExtendedDTO extends StageDTO {
  /**
   * The type of the stage.
   */
  type: StageType;
  position: number;
  color: string | null;

  constructor(stage: StageExtendedDTO) {
    super(stage);
    this.type = stage.type;
    this.position = stage.position;
    this.color = stage.color;
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
  position: number;
  color: string | null;
}
