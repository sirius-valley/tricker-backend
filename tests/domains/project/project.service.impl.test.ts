import { issueRepositoryMock, projectRepositoryMock, userRepositoryMock } from '../issue/mock';
import { NotFoundException } from '@utils';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { mockProjectDTO, mockUserDTO } from '../issue/mockData';
import { mockDevProjectFilterDTO, mockIssueViewDTO1, mockIssueViewDTO2, mockIssueViewDTO3, mockPMProjectFilterDTO, mockProjectBasicDTO, mockProjectsFilterInput } from './mockData';
import { type DevProjectFiltersDTO, type PMProjectFiltersDTO, type ProjectBasicDTO } from '@domains/project/dto';

describe('project service tests', () => {
  let projectService: ProjectService;

  beforeEach(() => {
    jest.resetAllMocks();
    projectService = new ProjectServiceImpl(projectRepositoryMock, issueRepositoryMock, userRepositoryMock);
  });

  describe('getDevProjectFilters method', () => {
    it('should successfully return an object with dynamic filters', async (): Promise<void> => {
      // given
      const projectId: string = 'Project777';
      const userId: string = 'user123';
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getByProjectIdAndUserId.mockResolvedValue([mockIssueViewDTO1, mockIssueViewDTO2]);
      const expected: DevProjectFiltersDTO = mockDevProjectFilterDTO;
      // when
      const received: DevProjectFiltersDTO = await projectService.getDevProjectFilters({ projectId, userId });
      // then
      expect.assertions(5);
      expect(expected.priorities.length).toEqual(received.priorities.length);
      expect(expected.priorities[0]).toEqual(received.priorities[0]);
      expect(expected.stages.length).toEqual(received.stages.length);
      expect(expected.stages[0]).toEqual(received.stages[0]);
      expect(expected.stages[1]).toEqual(received.stages[1]);
    });

    it('should throw NotFoundException when project is null', async (): Promise<void> => {
      // given
      const wrongProjectId: string = 'wrongProjectId';
      const wrongUserId: string = 'wrongUserId';
      // when
      projectRepositoryMock.getById.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find Project");
    });

    it('should throw NotFoundException when project is logically deleted', async (): Promise<void> => {
      // given
      const wrongProjectId: string = 'wrongProjectId';
      const wrongUserId: string = 'wrongUserId';
      // when
      projectRepositoryMock.getById.mockResolvedValue({ ...mockProjectDTO, deletedAt: new Date('2024-03-12T10:00:00Z') });
      // then
      expect.assertions(2);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find Project");
    });

    it('should throw NotFoundException when user is null', async (): Promise<void> => {
      // given
      const wrongProjectId: string = 'wrongProjectId';
      const wrongUserId: string = 'wrongUserId';
      // when
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when user is logically deleted', async (): Promise<void> => {
      // given
      const wrongProjectId: string = 'wrongProjectId';
      const wrongUserId: string = 'wrongUserId';
      // when
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue({ ...mockUserDTO, deletedAt: new Date('2024-03-12T10:00:00Z') });
      // then
      expect.assertions(2);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(projectService.getDevProjectFilters({ projectId: wrongProjectId, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });
  });

  describe('getPMProjectFilters method', () => {
    it('should successfully return an object with dynamic filters', async (): Promise<void> => {
      // given
      const projectId: string = 'Project777';
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getByProjectId.mockResolvedValue([mockIssueViewDTO1, mockIssueViewDTO2, mockIssueViewDTO3]);
      const expected: PMProjectFiltersDTO = mockPMProjectFilterDTO;
      // when
      const received: PMProjectFiltersDTO = await projectService.getPMProjectFilters(projectId);
      // then
      expect.assertions(7);
      expect(expected.priorities.length).toEqual(received.priorities.length);
      expect(expected.priorities[1]).toEqual(received.priorities[1]);
      expect(expected.stages.length).toEqual(received.stages.length);
      expect(expected.stages[0]).toEqual(received.stages[0]);
      expect(expected.stages[1]).toEqual(received.stages[1]);
      expect(expected.assignees.length).toEqual(received.assignees.length);
      expect(expected.assignees[1]).toEqual(received.assignees[1]);
    });
  });

  describe('getProjectsListByUserIdFiltered method', () => {
    it('should successfully get a list of projects for an specific user', async (): Promise<void> => {
      // given
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      projectRepositoryMock.getProjectsByUserId.mockResolvedValue([mockProjectBasicDTO]);
      const expected: ProjectBasicDTO[] = [mockProjectBasicDTO];
      // when
      const received: ProjectBasicDTO[] = await projectService.getProjectsListByUserIdFiltered(mockProjectsFilterInput);
      // then
      expect.assertions(3);
      expect(expected.length).toEqual(received.length);
      expect(expected[0].id).toEqual(received[0].id);
      expect(expected[0].name).toEqual(received[0].name);
    });

    it('should throw NotFoundException when user is logically deleted', async (): Promise<void> => {
      // given - when
      userRepositoryMock.getById.mockResolvedValue({ ...mockUserDTO, deletedAt: new Date() });
      // then
      expect.assertions(2);
      await expect(projectService.getProjectsListByUserIdFiltered(mockProjectsFilterInput)).rejects.toThrow(NotFoundException);
      await expect(projectService.getProjectsListByUserIdFiltered(mockProjectsFilterInput)).rejects.toThrow("Not found. Couldn't find User");
    });
  });
});
