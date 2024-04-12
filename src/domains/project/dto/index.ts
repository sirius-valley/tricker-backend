import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { type AssigneeFilterDataDTO } from '@domains/user';
import { type StageDTO } from '@domains/projectStage/dto';
import { type ProjectDataDTO, type UserRole } from '@domains/integration/dto';
import type { RoleDTO } from '@domains/role/dto';
import type { UserRoleDTO } from '@domains/userProjectRole/dto';
import type { IssueProviderDTO } from '@domains/issueProvider/dto';
import { Transform } from 'class-transformer';

/**
 * Data Transfer Object representing a partial view of the project, only principal data.
 */
export class ProjectDTO {
  /**
   * Unique identifier of the project.
   */
  id: string;
  /**
   * Name of the project.
   */
  name: string;
  /**
   * ID of the project in the external issue provider (if applicable).
   */
  providerId: string;
  /**
   * ID of the organization the project belongs to.
   */
  organizationId: string;
  /**
   * URL of the project image (if available).
   */
  image: string | null;
  /**
   * Date and time the project was created.
   */
  createdAt: Date;
  /**
   * Date and time the project was deleted (null if not deleted).
   */
  deletedAt: Date | null;

  /**
   * Date and time the project was synchronized with the integrated platform
   * */
  updatedAt: Date;

  /**
   * Url of the project in the integrated platform
   * */
  url: string;

  /**
   * ID of the issue provider used to perform the integration
   * */
  issueProviderId: string;

  /**
   * Constructor for ProjectDTO class.
   *
   * @param {ProjectDTO} project - Project data used to populate the DTO.
   */
  constructor(project: ProjectDTO) {
    this.id = project.id;
    this.name = project.name;
    this.providerId = project.providerId;
    this.organizationId = project.organizationId;
    this.image = project.image;
    this.createdAt = project.createdAt;
    this.deletedAt = project.deletedAt;
    this.url = project.url;
    this.issueProviderId = project.issueProviderId;
    this.updatedAt = project.updatedAt;
  }
}

/**
 * Interface defining the structure of basic project data.
 */
export interface BasicProjectDataInput {
  /** The name of the project. */
  name: string;

  /** The unique identifier of the project. */
  id: string;

  /** The project url of the provider. */
  projectUrl: string;

  /** The project image. */
  projectImage?: string;
}

/**
 * Represents the parameters for the project ID.
 */
export class ProjectIdParamDTO {
  @IsUUID()
  projectId!: string;
}

/**
 * Represents the project filters for a developer.
 */
export class DevProjectFiltersDTO {
  /** The stages available in the project. */
  stages: StageDTO[];
  /** The priorities available in the project. */
  priorities: string[];

  /**
   * Constructs a new instance of the DevProjectFiltersDTO class.
   * @param {DevProjectFiltersDTO} filters - The project filters.
   */
  constructor(filters: DevProjectFiltersDTO) {
    this.stages = filters.stages;
    this.priorities = filters.priorities;
  }
}

/**
 * Represents the project filters for a project manager.
 */
export class PMProjectFiltersDTO extends DevProjectFiltersDTO {
  /** The assignees available in the project. */
  assignees: AssigneeFilterDataDTO[];

  /**
   * Constructs a new instance of the PMProjectFiltersDTO class.
   * @param {PMProjectFiltersDTO} filters - The project filters.
   */
  constructor(filters: PMProjectFiltersDTO) {
    super(filters);
    this.assignees = filters.assignees;
  }
}

/**
 * Interface defining the structure of the input data for creating a project.
 *
 * @interface IntegratedProjectCreationInput
 */
export interface IntegratedProjectCreationInput {
  /**
   * Array of email addresses of authorized users for the project.
   */
  authorizedUsers: string[];
  /**
   * Array of user objects containing email and role information.
   */
  users: UserRole[];
  /**
   * Object containing project details like name, providerId, image, stages, and labels.
   */
  project: ProjectDataDTO;
  /**
   * ID of the organization the project belongs to.
   */
  organizationId: string;
  /**
   * Email address of the project integrator/pm.
   */
  integratorEmail: string;
  /**
   * Name of the issue provider used to integrate the project.
   */
  issueProviderName: string;
}

/**
 * Enumeration representing the different project roles.
 */
export enum ProjectRole {
  PROJECT_MANAGER = 'Project Manager',
  DEVELOPER = 'Developer',
}

/**
 * Represents the project name for the project filter.
 */
export class KeyPhraseParamDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  projectName?: string;
}

/**
 * DTO defining a basic data from a project
 */
export class ProjectBasicDTO {
  /** The name of the project. */
  name: string;

  /** The unique identifier of the project. */
  id: string;

  /** The project url of the provider. */
  projectImage?: string;

  /**
   * Constructs a new instance of the ProjectBasicDTO class.
   * @param {BasicProjectDataInput} project - The project.
   */
  constructor(project: ProjectBasicDTO) {
    this.id = project.id;
    this.name = project.name;
    this.projectImage = project.projectImage;
  }
}

/**
 * Input object for filtering projects.
 */
export interface ProjectsFilterInput {
  /** The ID of the user. */
  userId: string;

  /** (Optional) The name of the project to filter by. */
  projectName?: string;
}

/**
 * Interface defining the structure of a partial view of a project.
 *
 * This interface represents a subset of project data and its members for display purposes.
 */
export interface MyProjectViewDTO {
  /**
   * ID of the project in the issue provider platform.
   */
  providerId: string;
  /**
   * URL of the project image (if available).
   */
  image: string | null;
  /**
   * URL of the project in the issue provider platform.
   */
  url: string;
  /**
   * Name of the project.
   */
  name: string;
  /**
   * Name of the issue provider platform used to integrate the project.
   */
  issueProviderName: string;
  /**
   * Date and time the project information was synchronized with issue provider platform.
   */
  updatedAt: Date;
  /**
   * Array of ProjectUserViewDTO objects representing users associated with the project.
   */
  users: MyProjectsUserViewDTO[];
}

/**
 * Interface defining the structure of a partial view of project members/users.
 *
 * This interface represents a subset of user data for display within a project context.
 */
export interface MyProjectsUserViewDTO {
  /**
   * User's name (if available).
   */
  name: string | null;
  /**
   * User's email address.
   */
  email: string;
  /**
   * URL of the user's profile image (if available).
   */
  image: string | null;
  /**
   * Optional RoleDTO object representing the user's role in the project (if requester is a PM).
   */
  role?: RoleDTO;
}

/**
 * Represents detailed information about a project, including associated users and issue provider.
 *
 * This class extends `ProjectDTO` to provide additional project details.
 *
 * @extends ProjectDTO
 */
export class ProjectDetailsDTO extends ProjectDTO {
  /**
   * Array of UserRoleDTO objects representing users associated with the project and their roles.
   */
  usersAndRoles: UserRoleDTO[];

  /**
   * An IssueProviderDTO object containing details about the issue provider platform used for the project (optional).
   */
  issueProvider: IssueProviderDTO;

  /**
   * Creates a new ProjectDetailsDTO instance.
   *
   * @param {ProjectDetailsDTO} input - An object containing project details.
   */
  constructor(input: ProjectDetailsDTO) {
    super(input);
    this.usersAndRoles = input.usersAndRoles;
    this.issueProvider = input.issueProvider;
  }
}
