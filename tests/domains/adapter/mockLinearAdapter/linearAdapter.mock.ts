import { type IssueDataDTO } from '@domains/issue/dto';
import { type ProjectDataDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type EventInput } from '@domains/event/dto';
import { type AdaptProjectDataInputDTO } from '@domains/adapter/dto';

export class LinearAdapterMock implements ProjectManagementToolAdapter {
  async adaptAllProjectIssuesData(providerProjectId: string): Promise<IssueDataDTO[]> {
    return [];
  }

  async adaptIssueEventsData(providerIssueId: string): Promise<EventInput[]> {
    return [];
  }

  async adaptProjectData(input: AdaptProjectDataInputDTO): Promise<ProjectDataDTO> {
    return {
      projectId: 'idP',
      members: [{ email: 'mockUser@mock.com', role: 'Project Manager' }],
      projectName: 'Tricker',
      image: 'imageUrl',
      stages: [],
      labels: [],
    };
  }

  setKey(apiKey: string): void {}

  async getProjects(key: string | undefined): Promise<ProjectPreIntegratedDTO[]> {
    return [];
  }
}
