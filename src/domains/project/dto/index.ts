export class ProjectModel {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  deletedAt?: Date;

  constructor(project: ProjectModel) {
    this.id = project.id;
    this.name = project.name;
    this.url = project.url;
    this.createdAt = project.createdAt;
    this.deletedAt = project.deletedAt;
  }
}
