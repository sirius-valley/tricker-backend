import { IsString } from 'class-validator';

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

export class ProviderKeyDTO {
  @IsString()
  key!: string;

  @IsString()
  provider!: string;
}
