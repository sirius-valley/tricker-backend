import { type UserProjectRole } from '@utils/classes';

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
  profileImage: string | null;
  projectsRoleAssigned: UserProjectRole[];
  createdAt: Date;
  deletedAt: Date | null;
  emittedUserProjectRole: UserProjectRole[];

  constructor(user: UserDTO) {
    this.id = user.id;
    this.projectsRoleAssigned = user.projectsRoleAssigned;
    this.createdAt = user.createdAt;
    this.profileImage = user.profileImage;
    this.deletedAt = user.deletedAt;
    this.emittedUserProjectRole = user.emittedUserProjectRole;
  }
}
