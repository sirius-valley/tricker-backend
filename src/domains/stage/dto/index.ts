export class StageDTO {
  id: string;
  name: string;

  constructor(stage: StageDTO) {
    this.id = stage.id;
    this.name = stage.name;
  }
}
