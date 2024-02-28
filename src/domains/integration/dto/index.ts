export class ProjectPreIntegratedDTO {
  providerProjectId: string;
  name: string;
  image: string | undefined;

  constructor(project: ProjectPreIntegratedDTO) {
    this.providerProjectId = project.providerProjectId;
    this.name = project.name;
    this.image = project.image;
  }
}
