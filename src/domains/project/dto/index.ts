import { type StageExtendedDTO } from '@domains/stage/dto';
import { type Priority } from '@domains/issue';
import { IsUUID } from 'class-validator';
import { type AssigneeFilterDataDTO } from '@domains/user';

export class ProjectDTO {
  id: string;
  name: string;
  providerId: string;
  organizationId: string;
  image: string | null;
  createdAt: Date;
  deletedAt: Date | null;

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
  stages: StageExtendedDTO[];
  /** The priorities available in the project. */
  priorities: Priority[];

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
