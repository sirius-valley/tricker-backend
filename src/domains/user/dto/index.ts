import { type CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';

export type CustomCognitoIdTokenPayload = CognitoIdTokenPayload & {
  name: string;
  email: string;
};

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
  cognitoId: string | null;
  email: string;
  name: string | null;
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

export class CreateUserIdTokenDTO {
  providerId: string;
  email: string;
  name: string;

  constructor(input: CustomCognitoIdTokenPayload) {
    this.providerId = input.sub;
    this.email = input.email;
    this.name = input.name;
  }
}

export interface UserUpdateInputDTO {
  id: string;
  name: string;
  cognitoId: string;
  email?: string;
}
