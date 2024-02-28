import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type IntegrationService } from '@domains/integration/service/integration.service';
import { type ProjectMemberDataDTO } from '@domains/integration/dto';

export class IntegrationServiceImpl implements IntegrationService {
  constructor(private readonly projectManagementTool: ProjectManagementTool) {}

  async getMembers(projectId: string): Promise<ProjectMemberDataDTO[]> {
    return await this.projectManagementTool.getMembersByProjectId(projectId);
  }
}
