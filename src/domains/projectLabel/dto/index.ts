export class ProjectLabelDTO {
  id: string;
  projectId: string;
  labelId: string;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(projectLabel: ProjectLabelDTO) {
    this.id = projectLabel.id;
    this.projectId = projectLabel.projectId;
    this.labelId = projectLabel.labelId;
    this.createdAt = projectLabel.createdAt;
    this.deletedAt = projectLabel.deletedAt;
  }
}
