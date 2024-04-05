/**
 * Represents a stage within a project.
 */
export class StageDTO {
  /**
   * The unique identifier for the stage.
   */
  id: string;

  /**
   * The name of the stage.
   */
  name: string;

  /**
   * The type of the stage.
   */
  type: StageType;

  /**
   * The color associated with the stage.
   */
  color: string | null;

  /**
   * Constructs a new StageDTO object.
   * @param stage - An object containing stage data.
   */
  constructor(stage: StageDTO) {
    this.id = stage.id;
    this.name = stage.name;
    this.color = stage.color;
    this.type = stage.type;
  }
}

export type StageType = 'BACKLOG' | 'UNSTARTED' | 'STARTED' | 'COMPLETED' | 'CANCELED' | 'OTHER';

/**
 * Represents the order of stage types.
 */
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
  position: number;

  constructor(stage: StageExtendedDTO) {
    super(stage);
    this.position = stage.position;
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
