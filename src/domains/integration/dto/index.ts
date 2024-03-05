import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { IsDefined, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsValidIssueProvider } from '@utils/validation-annotations';

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

export class ProjectIdIntegrationInputDTO {
  @IsString()
  @IsNotEmpty()
  projectId!: string;
}

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

export interface HtmlReplaceWords {
  wordToReplace: string;
  replacingWord: string;
}

export class LinearMembersPreIntegrationParams {
  @IsUUID()
  readonly id!: string;
}

export class LinearMembersPreIntegrationBody {
  @IsString()
  @IsDefined()
  readonly apiToken!: string;
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

export interface MailPayload {
  adminId: string;
}
