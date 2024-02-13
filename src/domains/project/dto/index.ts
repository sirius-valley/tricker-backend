export class ProjectDTO {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(project: ProjectDTO) {
    this.id = project.id;
    this.name = project.name;
    this.url = project.url;
    this.createdAt = project.createdAt;
    this.deletedAt = project.deletedAt;
  }
}

export class ProjectDataDTO {
  projectId: string;
  members: UserRole[];
  projectName: string;

  constructor(projectId: string, members: UserRole[], name: string) {
    this.projectId = projectId;
    this.projectName = name;
    this.members = members;
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
