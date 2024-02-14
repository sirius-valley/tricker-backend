import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';

export class UserModel {
  id: string;
  password: string;

  constructor(input: UserModel) {
    this.id = input.password;
    this.password = input.password;
  }
}

export class UserDTO {
  id: string;
  cognitoId: string;
  email: string;
  name: string;
  profileImage: string | null;
  projectsRoleAssigned: UserProjectRoleDTO[];
  createdAt: Date;
  deletedAt: Date | null;
  emittedUserProjectRole: UserProjectRoleDTO[];

  constructor(user: UserDTO) {
    this.id = user.id;
    this.cognitoId = user.cognitoId;
    this.email = user.email;
    this.name = user.name;
    this.projectsRoleAssigned = user.projectsRoleAssigned;
    this.createdAt = user.createdAt;
    this.profileImage = user.profileImage;
    this.deletedAt = user.deletedAt;
    this.emittedUserProjectRole = user.emittedUserProjectRole;
  }
}
