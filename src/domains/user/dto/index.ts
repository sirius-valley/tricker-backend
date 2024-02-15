import { type UserProjectRole } from '@utils/classes';
import { type CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

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
  projectsRoleAssigned: UserProjectRole[];
  createdAt: Date;
  deletedAt: Date | null;
  emittedUserProjectRole: UserProjectRole[];

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

export class CreateUserIdTokenDTO {
  providerId: string;
  email: string;
  constructor(input: CognitoIdTokenPayload) {
    this.providerId = input.sub;
    this.email = input['cognito:username'];
  }
}
