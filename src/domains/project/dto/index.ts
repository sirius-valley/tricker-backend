export class ProjectDTO {
  id: string;
  name: string;
  providerId: string;
  image: string | null;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(project: ProjectDTO) {
    this.id = project.id;
    this.name = project.name;
    this.providerId = project.providerId;
    this.image = project.image;
    this.createdAt = project.createdAt;
    this.deletedAt = project.deletedAt;
  }
}

export class ProjectDataDTO {
  projectId: string;
  members: UserRole[];
  projectName: string;
  image: string | null;
  stages: string[];

  constructor(projectId: string, members: UserRole[], name: string, stages: string[], image: string | null) {
    this.projectId = projectId;
    this.projectName = name;
    this.members = members;
    this.image = image;
    this.stages = stages;
  }
}

export class UserRole {
  email: string;
  role: string;

  constructor(userRole: UserRole) {
    this.email = userRole.email;
    this.role = userRole.role;
  }
}
