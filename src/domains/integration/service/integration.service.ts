import { type ProjectMemberDataDTO } from '@domains/integration/dto';

export interface IntegrationService {
  getMembers: (projectId: string) => Promise<ProjectMemberDataDTO[]>;
}
