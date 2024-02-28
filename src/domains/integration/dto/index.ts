import type { PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsString } from 'class-validator';
import { type UserRole } from '@domains/project/dto';

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

export class ProjectIdIntegrationInputDTO {
  @IsString()
  @IsNotEmpty()
  projectId!: string;
}

export class ProjectPreIntegratedDTO {
  providerProjectId: string;
  name: string;
  image: string | undefined;

  constructor(project: ProjectPreIntegratedDTO) {
    this.providerProjectId = project.providerProjectId;
    this.name = project.name;
    this.image = project.image;
  }
}
