export class ProjectStageDTO {
  id: string;
  projectId: string;
  stageId: string;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(projectStage: ProjectStageDTO) {
    this.id = projectStage.id;
    this.projectId = projectStage.projectId;
    this.stageId = projectStage.stageId;
    this.createdAt = projectStage.createdAt;
    this.deletedAt = projectStage.deletedAt;
  }
}
