export class IssueDTO {
  id: string;
  authorId: string;
  assigneeId: string;
  projectId: string;
  stageId: string;
  issueLabelId: string;
  name: string;
  title: string;
  description: string;
  priority: string;
  storyPoints: number;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(issue: IssueDTO) {
    this.id = issue.id;
    this.authorId = issue.authorId;
    this.projectId = issue.projectId;
    this.stageId = issue.stageId;
    this.issueLabelId = issue.issueLabelId;
  }
}
