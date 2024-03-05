import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { ArrayMinSize, IsArray, IsDefined, IsEmail, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { IsValidIssueProvider, IsValidOrganization } from '@utils/validation-annotations';
import { Type } from 'class-transformer';
import 'reflect-metadata';

export class ProjectDataDTO {
  projectId: string;
  members: ProjectMemberDataDTO[];
  projectName: string;
  image: string | null;
  stages: string[];
  labels: string[];

  constructor(projectId: string, members: ProjectMemberDataDTO[], name: string, stages: string[], labels: string[], image: string | null) {
    this.projectId = projectId;
    this.projectName = name;
    this.members = members;
    this.image = image;
    this.stages = stages;
    this.labels = labels;
  }
}

export class UserRole {
  email: string;
  role: string;

  constructor(userRole: UserRole) {
    this.email = userRole.email;
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

export interface StageIntegrationInputDTO {
  projectId: string;
  stages: string[];
  db: Omit<PrismaClient, ITXClientDenyList>;
}

export interface LabelIntegrationInputDTO {
  projectId: string;
  labels: string[];
  db: Omit<PrismaClient, ITXClientDenyList>;
}

// TODO: document
export class ProjectIdIntegrationInputDTO {
  @IsString()
  @IsNotEmpty()
  projectId!: string;
}

// TODO: document
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

// TODO: document

/**
 * Represents a request for an integration authorization of a project
 */
export class AuthorizationRequest {
  /**
   * The provider specific API token/key to have access to the provider API
   * @type {string}
   * @example "token123"
   */
  @IsNotEmpty()
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
   * @example "memberId123"
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
  provider!: string;
}
