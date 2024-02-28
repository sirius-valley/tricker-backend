export class LabelDTO {
  id: string;
  name: string;

  constructor(label: LabelDTO) {
    this.id = label.id;
    this.name = label.name;
  }
}
