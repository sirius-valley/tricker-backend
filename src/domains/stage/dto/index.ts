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
