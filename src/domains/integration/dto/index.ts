import { IsDefined, IsString, IsUUID } from 'class-validator';

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

export class LinearMembersPreIntegrationParams {
  @IsUUID()
  readonly id!: string;
}

export class LinearMembersPreIntegrationBody {
  @IsString()
  @IsDefined()
  readonly apiToken!: string;
}
