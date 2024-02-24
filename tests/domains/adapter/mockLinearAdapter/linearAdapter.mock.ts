import { type ProjectManagementTool } from '@domains/adapter/projectManagementTool';
import { type ProjectDataDTO } from '@domains/project/dto';
import { type IssueDataDTO } from '@domains/issue/dto';

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

  async integrateAllProjectIssuesData(providerProjectId: string): Promise<IssueDataDTO[]> {
    return await Promise.resolve([]);
  }

  async integrateIssueEvents(providerIssueId: string): Promise<void> {
    await Promise.resolve(undefined);
  }
}
