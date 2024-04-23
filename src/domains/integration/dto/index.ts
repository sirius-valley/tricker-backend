import { ArrayMinSize, IsArray, IsDefined, IsEmail, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { IsValidApiKey, IsValidIssueProvider, IsValidOrganization } from '@utils/validation-annotations';
import { Transform, Type } from 'class-transformer';
import 'reflect-metadata';
import { type IssueDataDTO } from '@domains/issue/dto';

import { type StageType } from '@domains/projectStage/dto';
import type { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';

export class ProjectDataDTO {
  projectId: string;
  members: ProjectMemberDataDTO[];
  projectName: string;
  image: string | null;
  stages: StageData[];
  labels: string[];
  issues: IssueDataDTO[];
  url: string;

  constructor(input: ProjectDataDTO) {
    this.projectId = input.projectId;
    this.projectName = input.projectName;
    this.members = input.members;
    this.image = input.image;
    this.stages = input.stages;
    this.labels = input.labels;
    this.issues = input.issues;
    this.url = input.url;
  }
}

/**
 * Represents a user role object with data used in integration.
 */
export class UserRole {
  /**
   * The email of the user.
   */
  email: string;

  /**
   * The name of the user.
   */
  name: string;

  /**
   * The role of the user.
   */
  roleName: string;

  /**
   * Constructs a new instance of the UserRole class.
   * @param {UserRole} userRole - The user role object used to initialize the instance.
   */
  constructor(userRole: UserRole) {
    this.email = userRole.email;
    this.name = userRole.name;
    this.roleName = userRole.roleName;
  }
}
/**
 * Represents the provider project id pending to be integrated
 * */
export class ProjectIdIntegrationInputDTO {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  @IsValidIssueProvider()
  @Transform(({ value }) => value.trim().toUpperCase())
  issueProviderName!: string;
}

/**
 * Data transfer object (DTO) representing a pre-integrated project.
 */
export class ProjectPreIntegratedDTO {
  /**
   * ID of the project from the provider.
   */
  providerProjectId: string;

  /**
   * Name of the project.
   */
  name: string;

  /**
   * Image URL of the project, can be null.
   */
  image: string | null;

  /**
   * State of the project, represented by the ProjectState enum.
   */
  state: ProjectState;

  /**
   * Constructs a new instance of ProjectPreIntegratedDTO.
   * @param project - Object containing project data to initialize the DTO.
   */
  constructor(project: ProjectPreIntegratedDTO) {
    this.providerProjectId = project.providerProjectId;
    this.name = project.name;
    this.image = project.image;
    this.state = project.state;
  }
}

/**
 * Enum representing if a project has been already integrated.
 */
export enum ProjectState {
  NOT_ADDED = 'NOT_ADDED',
  PENDING = 'PENDING',
  ADDED = 'ADDED',
}

export interface ProjectsPreIntegratedInputDTO {
  apyKey: string;
  pmProviderId: string;
  issueProviderName: string;
}

export class ProjectMemberDataDTO {
  readonly providerId: string;
  readonly name: string;
  readonly email: string;

  constructor(input: ProjectMemberDataDTO) {
    this.providerId = input.providerId;
    this.name = input.name;
    this.email = input.email;
  }
}
/**
 * Class only exists with validation purposes
 * Represents the URL Params of the HTTP request for retrieving project members
 * */
export class LinearMembersPreIntegrationParams {
  /**
   * Provider specific project ID
   * @type {string}
   * @example "projectId123"
   * */
  @IsUUID()
  readonly id!: string;

  /**
   * Issue provider name for member retrieval
   * @type {string}
   * @example "Linear"
   * */
  @IsString()
  @IsNotEmpty()
  @IsValidIssueProvider()
  @Transform(({ value }) => value.trim().toUpperCase())
  issueProviderName!: string;
}

/**
 * Class only exists with validation purposes
 * Represents the body of the HTTP request for retrieving project members
 * */
export class LinearMembersPreIntegrationBody {
  /**
   * Provider specific API token to authorize API usage to make integration
   * @type {string}
   * @example "token123"
   * */
  @IsString()
  @IsDefined()
  readonly apiToken!: string;
}

/**
 * Represents a request for an integration authorization of a project
 */
export class AuthorizationRequestDTO {
  /**
   * The provider specific API token/key to have access to the provider API
   * @type {string}
   * @example "token123"
   */
  @IsNotEmpty()
  @IsValidApiKey({ message: 'Not valid API key for selected issue provider' })
  readonly apiToken!: string;

  /**
   * The provider specific project ID associated with the integration authorization
   * @type {string}
   * @example "projectId123"
   */
  @IsNotEmpty()
  readonly projectId!: string;

  /**
   * The provider specific ID of the user that is trying to integrate the project
   * */
  @IsNotEmpty()
  readonly integratorId!: string;

  /**
   * An array of provider specific member emails that will have access to working on the project
   * @type {AuthorizedMemberDTO[]}
   * @example ["user1@example.com.ar", "user1@example.edu.ch", "user1@example.com"]
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AuthorizedMemberDTO)
  readonly members!: AuthorizedMemberDTO[];

  /**
   * The name of the current organization trying to integrate the project
   * @type {string}
   * @example "SIRIUS", "MANDIANT", "GOOGLE"
   * */
  @IsValidOrganization()
  @IsNotEmpty()
  readonly organizationName!: string;

  /**
   * The name of the selected issue provider to make the integration
   * @type {string}
   * @example "LINEAR", "JIRA", "TRELLO"
   * */
  @IsValidIssueProvider()
  @IsNotEmpty()
  readonly issueProviderName!: string;
}

/**
 * Represents a member of the project that is pending for authorization
 * */
export class AuthorizedMemberDTO {
  /**
   * The provider specific ID of the member
   * @type {string}
   * @example "memberId123"
   * */
  @IsNotEmpty()
  readonly id!: string;

  /**
   * The email associated with the member
   * @type {string}
   * @example "example@example.com"
   * */
  @IsEmail()
  readonly email!: string;
}

/**
 * DTO that represents the provider api key to query the external API
 * */
export class ApiKeyDTO {
  @IsNotEmpty()
  @IsString()
  key!: string;
}

/**
 * Represents a token sent by email with the admin identity
 * */
export class MailToken {
  @IsNotEmpty()
  @IsString()
  token!: string;
}

/**
 * Represents the decoded payload of the token sent by email
 * */
export interface MailPayload {
  adminId: string;
}

/**
 * Represents the stage adapted data from the provider
 * */
export interface StageData {
  name: string;
  type: StageType;
  position: number;
  color: string;
}

/**
 * Function parameters that are supplied to integrate method to make the project integration
 * */
export interface IntegrationParams {
  projectId: string;
  integratorEmail: string;
  pendingProject: PendingProjectAuthorizationDTO;
  authorizedMemberMails: string[];
  organizationId: string;
  issueProviderName: string;
}

/**
 * Represents pending project information for linear integration.
 */
export class PendingProjectInfoDTO {
  /** The name of the project. */
  projectName: string;

  /** The URL of the project's image, if available. */
  projectImage: string | null;

  /** The name of the Project Manager. */
  pmName: string;

  /** The URL of the Project Manager's image, if available. */
  pmImage: string | null;

  /**
   * Constructs a new PendingProjectInfoDTO object.
   * @param info - The information object used to initialize the PendingProjectInfoDTO.
   */
  constructor(info: PendingProjectInfoDTO) {
    this.projectName = info.projectName;
    this.projectImage = info.projectImage;
    this.pmName = info.pmName;
    this.pmImage = info.pmImage;
  }
}

/**
 * DTO that represents the name of an issue provider, a URL param of the integration endpoint
 * */
export class IssueProviderURLParams {
  @IsString()
  @IsNotEmpty()
  @IsValidIssueProvider()
  @Transform(({ value }) => value.trim().toUpperCase())
  issueProviderName!: string;
}
