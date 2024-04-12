import { type IssueDataDTO } from '@domains/issue/dto';
import { type ProjectDataDTO, type ProjectMemberDataDTO, type ProjectPreIntegratedDTO } from '@domains/integration/dto';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type EventData } from '@domains/event/dto';
import { type AdaptProjectDataInput } from '@domains/adapter/dto';
import { type UserData } from '@domains/user';
import { type BasicProjectDataInput } from '@domains/project/dto';

export class LinearAdapterMock implements ProjectManagementToolAdapter {
  async adaptAllProjectIssuesData(providerProjectId: string): Promise<IssueDataDTO[]> {
    return [];
  }

  async adaptIssueEventsData(providerIssueId: string): Promise<EventData[]> {
    return [];
  }

  async adaptProjectData(input: AdaptProjectDataInput): Promise<ProjectDataDTO> {
    return {
      projectId: 'idP',
      members: [{ email: 'mockUser@mock.com', name: 'John Doe', providerId: 'pId' }],
      projectName: 'Tricker',
      image: 'imageUrl',
      stages: [],
      labels: [],
      issues: [],
      url: 'url',
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

  async getMemberById(memberId: string): Promise<UserData> {
    return { name: 'example member', email: 'uniqueEmail@mail.com', image: null };
  }

  async getProjectById(projectId: string): Promise<BasicProjectDataInput> {
    return { name: 'example project', id: 'project id', projectImage: undefined, projectUrl: 'someUrl' };
  }

  async getAndAdaptProjects(): Promise<ProjectPreIntegratedDTO[]> {
    return await Promise.resolve([]);
  }
}
