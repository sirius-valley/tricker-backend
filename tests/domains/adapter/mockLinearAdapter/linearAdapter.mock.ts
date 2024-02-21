import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectDataDTO } from '@domains/project/dto';

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
}
