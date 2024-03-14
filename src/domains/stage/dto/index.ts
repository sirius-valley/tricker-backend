export class StageDTO {
  id: string;
  name: string;

  constructor(stage: StageDTO) {
    this.id = stage.id;
    this.name = stage.name;
  }
}

const StageTypeEnum: {
  BACKLOG: 'BACKLOG';
  UNSTARTED: 'UNSTARTED';
  STARTED: 'STARTED';
  COMPLETED: 'COMPLETED';
  CANCELED: 'CANCELED';
  OTHER: 'OTHER';
} = {
  BACKLOG: 'BACKLOG',
  UNSTARTED: 'UNSTARTED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  OTHER: 'OTHER',
};

export type StageType = (typeof StageTypeEnum)[keyof typeof StageTypeEnum];
