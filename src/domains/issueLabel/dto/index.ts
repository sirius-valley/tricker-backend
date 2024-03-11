export class IssueLabelDTO {
  id: string;
  issueId: string;
  labelId: string;

  constructor(issueLabel: IssueLabelDTO) {
    this.id = issueLabel.id;
    this.labelId = issueLabel.labelId;
    this.issueId = issueLabel.issueId;
  }
}

export interface IssueLabelInput {
  issueId: string;
  labelId: string;
}
