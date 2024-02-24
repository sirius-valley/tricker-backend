export class StageDTO {
  id: string;
  name: string;

  constructor(stage: StageDTO) {
    this.id = stage.id;
    this.name = stage.name;
  }
}

export class StageDataDTO {
  providerId: string;
  name: string;

  constructor(stageData: StageDataDTO) {
    this.name = stageData.name;
    this.providerId = stageData.providerId;
  }
}
