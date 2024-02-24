export class LabelDTO {
  id: string;
  providerId: string;
  name: string;
  projectId: string;

  constructor(label: LabelDTO) {
    this.id = label.id;
    this.name = label.name;
    this.providerId = label.providerId;
    this.projectId = label.projectId;
  }
}

export class LabelDataDTO {
  providerId: string;
  name: string;

  constructor(label: LabelDataDTO) {
    this.name = label.name;
    this.providerId = label.providerId;
  }
}
