import { IsUUID } from 'class-validator';
import { type AssigneeFilterDataDTO } from '@domains/user';
import { type StageDTO } from '@domains/projectStage/dto';
import { type ProjectDataDTO, type UserRole } from '@domains/integration/dto';

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
   * ID of the project in the external provider system (if applicable).
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
  }
}

// todo: replace this with something more useful in the future
export interface BasicProjectDataDTO {
  name: string;
  id: string;
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
 * @interface ProjectCreationInput
 */
export interface ProjectCreationInput {
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
}

/**
 * Enumeration representing the different project roles.
 */
export enum ProjectRole {
  PROJECT_MANAGER = 'Project Manager',
  DEVELOPER = 'Developer',
}
