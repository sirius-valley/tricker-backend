import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { IsDefined, IsNotEmpty, IsUUID, IsString, ValidateNested, ArrayMinSize, IsArray, IsEmail } from 'class-validator';
import { type UserRole } from '@domains/project/dto';
import { IsValidIssueProvider, IsValidOrganization } from '@utils/validation-annotations';

export class ProjectDataDTO {
  projectId: string;
  members: UserRole[];
  projectName: string;
  image: string | null;
  stages: string[];
  labels: string[];

  constructor(projectId: string, members: UserRole[], name: string, stages: string[], labels: string[], image: string | null) {
    this.projectId = projectId;
    this.projectName = name;
    this.members = members;
    this.image = image;
    this.stages = stages;
    this.labels = labels;
  }
}

export interface MembersIntegrationInputDTO {
  projectData: ProjectDataDTO;
  projectId: string;
  emitterId: string;
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

// TODO: document
export class LinearMembersPreIntegrationParams {
  @IsUUID()
  readonly id!: string;
}

// TODO: document
export class LinearMembersPreIntegrationBody {
  @IsString()
  @IsDefined()
  readonly apiToken!: string;
}

// TODO: document

/**
 * Represents a request for an integration authorization of a project.
 */
export class AuthorizationRequest {
  /**
   * The provider specific API token/key to have access to the provider API.
   * @type {string}
   * @example "token123"
   */
  @IsNotEmpty()
  readonly apiToken!: string;

  /**
   * The provider specific project ID associated with the integration authorization.
   * @type {string}
   * @example "projectId123"
   */
  @IsNotEmpty()
  readonly projectId!: string;

  @IsNotEmpty()
  readonly integratorId!: string;

  /**
   * An array of provider specific member emails that will have access to working on the project.
   * @type {AuthorizedMemberDTO[]}
   * @example ["user1@example.com.ar", "user1@example.edu.ch", "user1@example.com"]
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  readonly members!: AuthorizedMemberDTO[];

  @IsValidOrganization()
  @IsNotEmpty()
  readonly organizationName!: string;

  @IsValidIssueProvider()
  @IsNotEmpty()
  readonly issueProviderName!: string;
}

export class AuthorizedMemberDTO {
  @IsNotEmpty()
  readonly id!: string;

  @IsEmail()
  readonly email!: string;
}
