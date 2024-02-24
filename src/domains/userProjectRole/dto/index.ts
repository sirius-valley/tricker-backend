export class UserProjectRoleDTO {
  id: string;
  userId: string;
  projectId: string;
  roleId: string;
  userEmitterId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(userProjectRole: UserProjectRoleDTO) {
    this.id = userProjectRole.id;
    this.projectId = userProjectRole.projectId;
    this.userId = userProjectRole.userId;
    this.roleId = userProjectRole.roleId;
    this.userEmitterId = userProjectRole.userEmitterId;
    this.createdAt = userProjectRole.createdAt;
    this.deletedAt = userProjectRole.deletedAt;
    this.updatedAt = userProjectRole.updatedAt;
  }
}
