import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { issueRepositoryMock, eventRepositoryMock, userRepositoryMock, projectRepositoryMock, userProjectRoleRepositoryMock, roleRepositoryMock } from './mock';
import { ConflictException, ForbiddenException, NotFoundException } from '@utils';
import {
  mockIssueDTO,
  stoppedMockTimeTrackingDTO,
  validMockManualTimeModification,
  invalidMockTimeTrackingDTO,
  mockUserDTO,
  mockProjectDTO,
  mockIssueViewDTO,
  mockDevIssueFilterParameters,
  mockNotRegisteredUserDTO,
  mockPMRoleDTO,
  mockUserProjectRoleDTO,
  mockPMIssueFilterParameters,
  mockLogicallyDeletedUserDTO,
  mockDevRoleDTO,
} from './mockData';
import { type IssueViewDTO, type WorkedTimeDTO } from '@domains/issue/dto';

describe('issue service tests', () => {
  let issueService: IssueService;

  beforeEach(() => {
    jest.resetAllMocks();
    issueService = new IssueServiceImpl(issueRepositoryMock, eventRepositoryMock, userRepositoryMock, projectRepositoryMock, userProjectRoleRepositoryMock, roleRepositoryMock);
  });

  describe('pause method', () => {
    it('should throw NotFoundException when issue is null', async () => {
      // issue == null

      // given
      const issueId = 'someIssueId';
      issueRepositoryMock.getById.mockResolvedValue(null);

      // when
      let result;
      try {
        result = await issueService.pauseTimer(issueId);
      } catch (error) {
        result = error;
      }

      // then
      expect(result).toBeInstanceOf(NotFoundException);
    });

    it('should throw ConflictException when lastTimeTrackingEvent is null', async () => {
      // lastTimeTrackingEvent == null

      // given
      const issueId = 'someIssueId';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      eventRepositoryMock.getLastTimeTrackingEvent.mockResolvedValue(null);

      // when
      let result;
      try {
        result = await issueService.pauseTimer(issueId);
      } catch (error) {
        result = error;
      }

      // then
      expect(result).toBeInstanceOf(ConflictException);
    });

    it('should throw ConflictException when lastTimeTrackingEvent.endTime is not null', async () => {
      // lastTimeTrackingEvent.endTime != null

      // given
      const issueId = 'someIssueId';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      eventRepositoryMock.getLastTimeTrackingEvent.mockResolvedValue(invalidMockTimeTrackingDTO);

      // when
      let result;
      try {
        result = await issueService.pauseTimer(issueId);
      } catch (error) {
        result = error;
      }

      // then
      expect(result).toBeInstanceOf(ConflictException);
    });
  });

  describe('getIssueWorkedSeconds method', () => {
    it('should successfully get issue worked seconds', async (): Promise<void> => {
      // given
      const issueId: string = 'issue789';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      eventRepositoryMock.getIssueTimeTrackingEvents.mockResolvedValue([stoppedMockTimeTrackingDTO, stoppedMockTimeTrackingDTO]);
      eventRepositoryMock.getIssueManualTimeModification.mockResolvedValue([validMockManualTimeModification]);
      const expectedSeconds: number = 7210;
      // when
      const receivedSeconds: WorkedTimeDTO = await issueService.getIssueWorkedSeconds(issueId);
      // then
      expect.assertions(1);
      expect(receivedSeconds.workedTime).toEqual(expectedSeconds);
    });

    it('should return zero seconds when no tracking events or manual changes performed', async (): Promise<void> => {
      // given
      const issueId: string = 'issue789';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      eventRepositoryMock.getIssueTimeTrackingEvents.mockResolvedValue([]);
      eventRepositoryMock.getIssueManualTimeModification.mockResolvedValue([]);
      const expectedSeconds: number = 0;
      // when
      const receivedSeconds: WorkedTimeDTO = await issueService.getIssueWorkedSeconds(issueId);
      // then
      expect.assertions(1);
      expect(receivedSeconds.workedTime).toEqual(expectedSeconds);
    });

    it('should throw NotFoundException when issue is null', async (): Promise<void> => {
      // given
      const wrongIssueId: string = 'wrongIssueId';
      // when
      issueRepositoryMock.getById.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(issueService.getIssueWorkedSeconds(wrongIssueId)).rejects.toThrow(NotFoundException);
      await expect(issueService.getIssueWorkedSeconds(wrongIssueId)).rejects.toThrow("Not found. Couldn't find Issue");
    });
  });

  describe('getDevIssuesFilteredAndPaginated method', () => {
    it('should successfully get an Array of previously filtered IssueViewDTO', async (): Promise<void> => {
      // given
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      jest.spyOn(issueService, 'getIssuesFilteredAndPaginated').mockResolvedValue([mockIssueViewDTO]);
      const expectedArray: IssueViewDTO[] = [mockIssueViewDTO];
      // when
      const receivedArray: IssueViewDTO[] = await issueService.getDevIssuesFilteredAndPaginated(mockDevIssueFilterParameters);
      // then
      expect.assertions(2);
      expect(receivedArray.length).toEqual(expectedArray.length);
      expect(receivedArray[0].id).toEqual(expectedArray[0].id);
    });

    it('should throw NotFoundException when user id is not correct', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getById.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when user is not a tricker user', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getById.mockResolvedValue(mockNotRegisteredUserDTO);
      // then
      expect.assertions(2);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when user has been logically deleted', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getById.mockResolvedValue(mockLogicallyDeletedUserDTO);
      // then
      expect.assertions(2);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when project id is not correct', async (): Promise<void> => {
      // given
      const wrongProjectId = 'wrongId';
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      // when
      projectRepositoryMock.getById.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, projectId: wrongProjectId })).rejects.toThrow(NotFoundException);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockDevIssueFilterParameters, projectId: wrongProjectId })).rejects.toThrow("Not found. Couldn't find Project");
    });
  });

  describe('getPMIssuesFilteredAndPaginated method', () => {
    it('should successfully get an Array of previously filtered IssueViewDTO', async (): Promise<void> => {
      // given
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userProjectRoleRepositoryMock.getByProjectIdAndUserId.mockResolvedValue(mockUserProjectRoleDTO);
      roleRepositoryMock.getById.mockResolvedValue(mockPMRoleDTO);
      jest.spyOn(issueService, 'getIssuesFilteredAndPaginated').mockResolvedValue([mockIssueViewDTO]);
      const expectedArray: IssueViewDTO[] = [mockIssueViewDTO];
      // when
      const receivedArray: IssueViewDTO[] = await issueService.getDevIssuesFilteredAndPaginated(mockPMIssueFilterParameters);
      // then
      expect.assertions(2);
      expect(receivedArray.length).toEqual(expectedArray.length);
      expect(receivedArray[0].id).toEqual(expectedArray[0].id);
    });

    it('should throw ForbiddenException when user is not a Project Manager', async (): Promise<void> => {
      // given
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      projectRepositoryMock.getById.mockResolvedValue(mockProjectDTO);
      userProjectRoleRepositoryMock.getByProjectIdAndUserId.mockResolvedValue(mockUserProjectRoleDTO);
      // when
      roleRepositoryMock.getById.mockResolvedValue(mockDevRoleDTO);
      // then
      expect.assertions(1);
      await expect(issueService.getPMIssuesFilteredAndPaginated(mockPMIssueFilterParameters)).rejects.toThrow(ForbiddenException);
    });
  });
});
