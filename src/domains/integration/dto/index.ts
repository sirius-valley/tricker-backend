import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { ArrayMinSize, IsArray, IsDefined, IsEmail, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { IsValidApiKey, IsValidIssueProvider, IsValidOrganization } from '@utils/validation-annotations';
import { Transform, Type } from 'class-transformer';
import 'reflect-metadata';
import { type IssueDataDTO } from '@domains/issue/dto';
import type { EventInput } from '@domains/event/dto';

import { type StageType } from '@domains/projectStage/dto';

export class ProjectDataDTO {
  projectId: string;
  members: ProjectMemberDataDTO[];
  projectName: string;
  image: string | null;
  stages: StageData[];
  labels: string[];
  issues: IssueDataDTO[];

  constructor(projectId: string, members: ProjectMemberDataDTO[], name: string, stages: StageData[], labels: string[], image: string | null, issues: IssueDataDTO[]) {
    this.projectId = projectId;
    this.projectName = name;
    this.members = members;
    this.image = image;
    this.stages = stages;
    this.labels = labels;
    this.issues = issues;
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
  role: string;

  /**
   * Constructs a new instance of the UserRole class.
   * @param {UserRole} userRole - The user role object used to initialize the instance.
   */
  constructor(userRole: UserRole) {
    this.email = userRole.email;
    this.name = userRole.name;
    this.role = userRole.role;
  }
}

export interface MembersIntegrationInputDTO {
  memberRoles: UserRole[];
  projectId: string;
  emitterId: string;
  acceptedUsers: string[];
  db: Omit<PrismaClient, ITXClientDenyList>;
}

/**
 * Interface representing input data for stage integration.
 */
export interface StageIntegrationInput {
  projectId: string;
  stages: StageData[];
  db: Omit<PrismaClient, ITXClientDenyList>;
}

export interface LabelIntegrationInputDTO {
  projectId: string;
  labels: string[];
  db: Omit<PrismaClient, ITXClientDenyList>;
}

/**
 * Represents the provider project id pending to be integrated
 * */
export class ProjectIdIntegrationInputDTO {
  @IsString()
  @IsNotEmpty()
  projectId!: string;
}

/**
 * Represents a project sent to the integrator in the project integration request flow
 * */
export class ProjectPreIntegratedDTO {
  providerProjectId: string;
  name: string;
  image: string | null;

  constructor(project: ProjectPreIntegratedDTO) {
    this.providerProjectId = project.providerProjectId;
    this.name = project.name;
    this.image = project.image;
  }
}

export interface ProjectsPreIntegratedInputDTO {
  providerName: string;
  apyKey: string;
  pmProviderId: string;
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

export interface IssueIntegrationInputDTO {
  projectId: string;
  issues: IssueDataDTO[];
  db: Omit<PrismaClient, ITXClientDenyList>;
}

export interface EventIntegrationInputDTO {
  issueId: string;
  events: EventInput[];
  db: Omit<PrismaClient, ITXClientDenyList>;
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

export class ProviderKeyDTO {
  @IsNotEmpty()
  @IsString()
  key!: string;

  @IsString()
  @IsNotEmpty()
  @IsValidIssueProvider()
  @Transform(({ value }) => value.trim().toUpperCase())
  provider!: string;
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
}
