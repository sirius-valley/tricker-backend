import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectDataDTO } from '@domains/project/dto';
import { UnauthorizedException } from '@utils';
import { type ProjectPreIntegratedDTO } from '@domains/integration/dto';

export class LinearAdapterMock implements ProjectManagementTool {
  async integrateProjectData(projectId: string, pmId: string): Promise<ProjectDataDTO> {
    return {
      projectId: 'idP',
      members: [{ email: 'mockUser@mock.com', role: 'Project Manager' }],
      projectName: 'Tricker',
      image: 'imageUrl',
      stages: [],
    };
  }

  async getProjects(key: string | undefined): Promise<ProjectPreIntegratedDTO[]> {
    return [];
  }

  validateSecret(secret: string | undefined): void {
    if (secret === '' || secret === undefined) throw new UnauthorizedException(undefined, 'MISSING_SECRET');
    if (!secret.startsWith('lin_api_')) throw new UnauthorizedException(undefined, 'NOT_VALID_SECRET');
  }
}
