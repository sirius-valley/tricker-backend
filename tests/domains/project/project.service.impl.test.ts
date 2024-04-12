import { issueRepositoryMock, projectRepositoryMock, userRepositoryMock } from '../issue/mock';
import { NotFoundException } from '@utils';
import { type ProjectService, ProjectServiceImpl } from '@domains/project/service';
import { mockProjectDTO, mockUserDTO } from '../issue/mockData';
import { mockDevProjectFilterDTO, mockIssueViewDTO1, mockIssueViewDTO2, mockIssueViewDTO3, mockPMProjectFilterDTO } from './mockData';
import { type DevProjectFiltersDTO, type MyProjectViewDTO, type PMProjectFiltersDTO, type ProjectDetailsDTO } from '@domains/project/dto';
import { type UserDTO } from '@domains/user';
import { type UserRoleDTO } from '@domains/userProjectRole/dto';
import { type RoleDTO } from '@domains/role/dto';
import { type IssueProviderDTO } from '@domains/issueProvider/dto';

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

  describe('getMyProjectView method', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'user-123';
      const projectId = 'project-456';
      userRepositoryMock.getByCognitoId.mockResolvedValueOnce(null);

      try {
        await projectService.getMyProjectView({ userId, projectId });
      } catch (e: any) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("Not found. Couldn't find User");
      }

      expect(userRepositoryMock.getByCognitoId).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.getByCognitoId).toHaveBeenCalledWith(userId);
      expect(projectRepositoryMock.getProjectDetails).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if project is not found or user has no access', async () => {
      const userId = 'user-123';
      const projectId = 'project-456';
      const user = { id: userId, name: 'John Doe' } as unknown as UserDTO;
      userRepositoryMock.getByCognitoId.mockResolvedValueOnce(user);
      projectRepositoryMock.getProjectDetails.mockResolvedValueOnce(null);

      try {
        await projectService.getMyProjectView({ userId, projectId });
      } catch (e: any) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("Not found. Couldn't find Project");
      }

      expect(userRepositoryMock.getByCognitoId).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.getByCognitoId).toHaveBeenCalledWith(userId);
      expect(projectRepositoryMock.getProjectDetails).toHaveBeenCalledTimes(1);
      expect(projectRepositoryMock.getProjectDetails).toHaveBeenCalledWith(userId, projectId);
    });

    it('returns MyProjectViewDTO with user details if user is a Project Manager', async () => {
      const userId = 'user-123';
      const projectId = 'project-456';
      const roleId = 'role-123';
      const issueProviderId = 'issueProviderId-123';
      const role: RoleDTO = { id: roleId, name: 'Project Manager' };
      const issueProvider: IssueProviderDTO = { id: issueProviderId, name: 'Linear' };
      const user = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        profileImage: 'https://avatar.com',
        cognitoId: 'cognitoId-123',
        createdAt: new Date(),
        deletedAt: new Date(),
      } as unknown as UserDTO;
      const userAndRole: UserRoleDTO = {
        id: 'projectUserRoleId',
        userEmitterId: 'otherUserId-123',
        projectId,
        roleId,
        createdAt: new Date(),
        deletedAt: new Date(),
        updatedAt: new Date(),
        userId,
        user,
        role,
      };
      const project: ProjectDetailsDTO = {
        id: projectId,
        providerId: 'provider-1',
        image: 'https://image.com',
        url: 'https://project.com',
        name: 'My Project',
        createdAt: new Date(),
        deletedAt: new Date(),
        issueProvider,
        issueProviderId,
        organizationId: 'orgId-123',
        updatedAt: new Date(),
        usersAndRoles: [userAndRole],
      };
      const expectedProjectView: MyProjectViewDTO = {
        providerId: project.providerId,
        image: project.image,
        url: project.url,
        name: project.name,
        issueProviderName: project.issueProvider.name,
        updatedAt: project.updatedAt,
        users: [{ name: user.name, email: user.email, image: user.profileImage, role: project.usersAndRoles[0].role }],
      };

      userRepositoryMock.getByCognitoId.mockResolvedValueOnce(user);
      projectRepositoryMock.getProjectDetails.mockResolvedValueOnce(project);

      const result = await projectService.getMyProjectView({ userId, projectId });

      expect(result).toEqual(expectedProjectView);

      expect(userRepositoryMock.getByCognitoId).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.getByCognitoId).toHaveBeenCalledWith(userId);
      expect(projectRepositoryMock.getProjectDetails).toHaveBeenCalledTimes(1);
      expect(projectRepositoryMock.getProjectDetails).toHaveBeenCalledWith(userId, projectId);
    });
  });
});
