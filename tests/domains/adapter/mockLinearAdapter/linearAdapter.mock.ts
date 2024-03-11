import { type IssueDataDTO } from '@domains/issue/dto';
import { type ProjectDataDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type EventInput } from '@domains/event/dto';
import { type AdaptProjectDataInputDTO } from '@domains/adapter/dto';
import { type UserDataDTO } from '@domains/user';
import { type BasicProjectDataDTO } from '@domains/project/dto';

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
      members: [{ email: 'mockUser@mock.com', name: 'John Doe', providerId: 'pId' }],
      projectName: 'Tricker',
      image: 'imageUrl',
      stages: [],
      labels: [],
      issues: [],
    };
  }

  setKey(apiKey: string): void {}

  async getProjects(key: string | undefined): Promise<ProjectPreIntegratedDTO[]> {
    return [];
  }

  async getMyEmail(apiKey: string): Promise<string> {
    return '';
  }

  async getMembersByProjectId(providerProjectId: string): Promise<ProjectMemberDataDTO[]> {
    return [];
  }

  async getMemberById(memberId: string): Promise<UserDataDTO> {
    return { name: 'example member' };
  }

  async getProjectById(projectId: string): Promise<BasicProjectDataDTO> {
    return { name: 'example project', id: 'project id' };
  }

  async getAndAdaptProjects(): Promise<ProjectPreIntegratedDTO[]> {
    return await Promise.resolve([]);
  }
}
