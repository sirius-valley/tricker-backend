import { type CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { type UserProjectRoleExtendedDTO } from '@domains/userProjectRole/dto';
import { IsUUID } from 'class-validator';

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

/**
 * Class representing a Basic User Data Transfer Object.
 *
 * This class contains basic user information.
 *
 * @class BasicUserDTO
 */
export class BasicUserDTO {
  /**
   * Unique identifier of the user.
   */
  id: string;
  /**
   * ID of the user in the Cognito authentication system (if applicable).
   */
  cognitoId: string | null;
  /**
   * User's email address.
   */
  email: string;
  /**
   * User's name (optional).
   */
  name: string | null;
  /**
   * URL of the user's profile image (optional).
   */
  profileImage: string | null;
  /**
   * Date and time the user was created.
   */
  createdAt: Date;
  /**
   * Date and time the user was deleted (null if not deleted).
   */
  deletedAt: Date | null;

  /**
   * Constructor for BasicUserDTO class.
   *
   * @param {BasicUserDTO} input - User data used to populate the DTO.
   */
  constructor(input: BasicUserDTO) {
    this.id = input.id;
    this.cognitoId = input.cognitoId;
    this.email = input.email;
    this.name = input.name;
    this.profileImage = input.profileImage;
    this.createdAt = input.createdAt;
    this.deletedAt = input.deletedAt;
  }
}

/**
 * Class representing a User Data Transfer Object.
 *
 * This class extends BasicUserDTO and includes additional information about project roles.
 *
 * @class UserDTO
 * @extends BasicUserDTO
 */
export class UserDTO extends BasicUserDTO {
  /**
   * Array of UserProjectRoleExtendedDTO objects representing the user's assigned project roles.
   */
  projectsRoleAssigned: UserProjectRoleExtendedDTO[];
  /**
   * Array of UserProjectRoleExtendedDTO objects representing the project roles the user has emitted (created).
   */
  emittedUserProjectRole: UserProjectRoleExtendedDTO[];

  /**
   * Constructor for UserDTO class.
   *
   * @param {UserDTO} user - User data used to populate the DTO.
   */
  constructor(user: UserDTO) {
    super(user);
    this.projectsRoleAssigned = user.projectsRoleAssigned;
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

/**
 * Represents user data retrieved from Linear.
 */
export interface UserData {
  /** The name of the user. */
  name: string;

  /** The email address of the user. */
  email: string;

  /** The image url of the user (if available) */
  image: string | null;
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

export class UserParamDTO {
  @IsUUID()
  userId!: string;
}
