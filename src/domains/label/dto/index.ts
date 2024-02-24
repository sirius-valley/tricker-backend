export class LabelDataDTO {
  providerId: string;
  name: string;

  constructor(label: LabelDataDTO) {
    this.name = label.name;
    this.providerId = label.providerId;
  }
}
