import { type RoleDTO } from '@domains/role/dto';
import { type ProjectDTO } from '@domains/project/dto';
import { type BasicUserDTO } from '@domains/user';
import { IsUUID } from 'class-validator';

/**
 * Data Transfer Object (DTO) representing a user's project role.
 */
export class UserProjectRoleDTO {
  /** Unique identifier of the user's project role. */
  id: string;
  /** Identifier of the user associated with the project role. */
  userId: string;
  /** Identifier of the project associated with the project role. */
  projectId: string;
  /** Identifier of the role associated with the project role. */
  roleId: string;
  /** Identifier of the user who emitted the project role. */
  userEmitterId: string;
  /** Date and time when the project role was created. */
  createdAt: Date;
  /** Date and time when the project role was last updated. */
  updatedAt: Date;
  /** Date and time when the project role was deleted, if applicable. */
  deletedAt: Date | null;

  /**
   * Constructs a new instance of UserProjectRoleDTO.
   * @param userProjectRole An object containing properties to initialize the DTO.
   */
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

/**
 * Class representing an Extended User Project Role Data Transfer Object.
 *
 * This class extends UserProjectRoleDTO and includes additional information about the user, project, and role.
 *
 */
export class UserRoleDTO extends UserProjectRoleDTO {
  /**
   * DTO representing the user basic data associated with the project and the role.
   */
  user: BasicUserDTO;

  /**
   * DTO representing the user's role in the project.
   */
  role: RoleDTO;

  /**
   * Constructor for ExtendedUserProjectRoleDTO class.
   *
   * @param {UserRoleDTO} input - Data used to populate the DTO.
   */
  constructor(input: UserRoleDTO) {
    super(input);
    this.user = input.user;
    this.role = input.role;
  }
}

/**
 * Interface representing input data for creating a user's project role.
 */
export interface UserProjectRoleInput {
  /** Identifier of the user associated with the project role. */
  userId: string;
  /** Identifier of the project associated with the project role. */
  projectId: string;
  /** Identifier of the role associated with the project role. */
  roleId: string;
  /** Identifier of the user who emits the project role. */
  userEmitterId: string;
  /** Boolean indicating whether the project role is accepted or not. */
  isAccepted: boolean;
}

/**
 * Data Transfer Object (DTO) representing an extended user's project role including role and project details.
 */
export class UserProjectRoleExtendedDTO extends UserProjectRoleDTO {
  /** Details of the role associated with the project role. */
  role: RoleDTO;
  /** Details of the project associated with the project role. */
  project: ProjectDTO;

  /**
   * Constructs a new instance of UserProjectRoleExtendedDTO.
   * @param userProjectRole An object containing properties to initialize the DTO.
   */
  constructor(userProjectRole: UserProjectRoleExtendedDTO) {
    super(userProjectRole);
    this.role = userProjectRole.role;
    this.project = userProjectRole.project;
  }
}

/**
 * Data Transfer Object (DTO) for User and project Input
 * This DTO is used for transferring user and project input data to the server.
 */
export class UserProjectInputDTO {
  /** The ID of the user whose role will be modified. */
  @IsUUID()
  userId!: string;

  /** The ID of the project where the role will be modified. */
  @IsUUID()
  projectId!: string;
}

/**
 * Data Transfer Object (DTO) for Role Input
 * This DTO is used for transferring role input data to the server.
 */
export class RoleInputDTO {
  /** The ID of the role. */
  @IsUUID()
  roleId!: string;
}

/**
 * Interface representing input data for updating a user's project role.
 */
export interface UserProjectRoleUpdateInput {
  /** Identifier of the user associated with the project role. */
  userId: string;
  /** Identifier of the project associated with the project role. */
  projectId: string;
  /** Identifier of the role associated with the project role. */
  roleId: string;
  /** Identifier of the user who emits the project role. */
  userEmitterId?: string;
  /** Name of the user who emits the project role. */
  userEmitterCognitoId: string;
}

/**
 * Interface representing input data for updating a user's project role in the repository.
 */
export interface UserProjectRoleUpdateExtended extends UserProjectRoleInput {
  /** Identifier of the userProjectRole to be updated. */
  id: string;
}
