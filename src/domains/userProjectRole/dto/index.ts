import { type RoleDTO } from '@domains/role/dto';
import { type ProjectDTO } from '@domains/project/dto';

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
 * Data Transfer Object (DTO) representing input data for creating a user's project role.
 */
export interface UserProjectRoleInputDTO {
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
