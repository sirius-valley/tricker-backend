export class StageDTO {
  id: string;
  name: string;

  constructor(stage: StageDTO) {
    this.id = stage.id;
    this.name = stage.name;
  }
}

export type StageType = 'BACKLOG' | 'UNSTARTED' | 'STARTED' | 'COMPLETED' | 'CANCELED' | 'OTHER';

export class StageExtendedDTO {
  id: string;
  name: string;
  type: StageType;

  constructor(stage: StageExtendedDTO) {
    this.id = stage.id;
    this.name = stage.name;
    this.type = stage.type;
  }
}
