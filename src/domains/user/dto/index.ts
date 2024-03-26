import { type CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserProjectRoleExtendedDTO } from '@domains/userProjectRole/dto';

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
  projectsRoleAssigned: UserProjectRoleExtendedDTO[];
  createdAt: Date;
  deletedAt: Date | null;
  emittedUserProjectRole: UserProjectRoleExtendedDTO[];

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

// todo: replace this with something more useful in the future
export interface UserDataDTO {
  name: string;
}

export class UserIssueDTO {
  id: string;
  name: string | null;
  profileUrl: string | null;

  constructor(user: UserIssueDTO) {
    this.id = user.id;
    this.name = user.name;
    this.profileUrl = user.profileUrl;
  }
}

/**
 * Represents an array of assignees that will br used as filter parameter.
 */
export class AssigneeFilterDataDTO {
  /** The ID of the assignee. */
  id: string;

  /** The name of the assignee. */
  name: string;

  /**
   * Constructs a new instance of the AssigneeFilterDataDTO class.
   * @param assignee - The assignee object used to initialize the instance.
   */
  constructor(assignee: AssigneeFilterDataDTO) {
    this.id = assignee.id;
    this.name = assignee.name;
  }
}
