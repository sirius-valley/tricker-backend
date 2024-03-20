import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { issueRepositoryMock, eventRepositoryMock, userRepositoryMock, projectRepositoryMock, projectStageRepositoryMock } from './mock';
import { ConflictException, NotFoundException } from '@utils';
import {
  mockIssueDTO,
  stoppedMockTimeTrackingDTO,
  validMockManualTimeModification,
  invalidMockTimeTrackingDTO,
  mockUserDTO,
  mockProjectDTO,
  mockIssueViewDTO,
  mockIssueFilterParameters,
  mockNotRegisteredUserDTO,
  validMockTimeTrackingDTO,
  mockIssueDTOWithoutStage,
  mockProjectStageDTO,
  mockProjectStageDTOStarted,
} from './mockData';
import { type IssueViewDTO, type WorkedTimeDTO } from '@domains/issue/dto';
import { type TimeTrackingDTO } from '@domains/event/dto';

describe('issue service tests', () => {
  let issueService: IssueService;

  beforeEach(() => {
    jest.resetAllMocks();
    issueService = new IssueServiceImpl(issueRepositoryMock, eventRepositoryMock, userRepositoryMock, projectRepositoryMock, projectStageRepositoryMock);
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
      const receivedArray: IssueViewDTO[] = await issueService.getDevIssuesFilteredAndPaginated(mockIssueFilterParameters);
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
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockIssueFilterParameters, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockIssueFilterParameters, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when user is not a tricker user', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getById.mockResolvedValue(mockNotRegisteredUserDTO);
      // then
      expect.assertions(2);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockIssueFilterParameters, userId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockIssueFilterParameters, userId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when project id is not correct', async (): Promise<void> => {
      // given
      const wrongProjectId = 'wrongId';
      userRepositoryMock.getById.mockResolvedValue(mockUserDTO);
      // when
      projectRepositoryMock.getById.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockIssueFilterParameters, projectId: wrongProjectId })).rejects.toThrow(NotFoundException);
      await expect(issueService.getDevIssuesFilteredAndPaginated({ ...mockIssueFilterParameters, projectId: wrongProjectId })).rejects.toThrow("Not found. Couldn't find Project");
    });
  });

  describe('resumeTimer method', () => {
    it('should throw NotFoundException if issue does not exist', async () => {
      // given
      const issueId = 'nonexistentIssueId';
      issueRepositoryMock.getById.mockResolvedValue(null);

      // when
      const result = issueService.resumeTimer(issueId);

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if issue does not have stage', async () => {
      // given
      const issueId = mockIssueDTOWithoutStage.id;
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTOWithoutStage);

      // when
      const result = issueService.resumeTimer(issueId);

      // then
      await expect(result).rejects.toThrow(ConflictException);
      await expect(result).rejects.toThrow('This issue needs to be started in order to be able to track time');
    });

    it('should throw ConflictException if issue stage is not started type', async () => {
      // given
      const issueId = 'issueId';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      projectStageRepositoryMock.getByProjectIdAndStageId.mockResolvedValue(mockProjectStageDTO);

      // when
      const result = issueService.resumeTimer(issueId);

      // then
      await expect(result).rejects.toThrow(ConflictException);
      await expect(result).rejects.toThrow('This issue needs to be started in order to be able to track time');
    });

    it('should throw ConflictException if issue is already tracking time', async () => {
      // given
      const issueId = 'issueId';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      projectStageRepositoryMock.getByProjectIdAndStageId.mockResolvedValue(mockProjectStageDTOStarted);
      eventRepositoryMock.getLastTimeTrackingEvent.mockResolvedValue(validMockTimeTrackingDTO);

      const result = issueService.resumeTimer(issueId);

      // then
      await expect(result).rejects.toThrow(ConflictException);
      await expect(result).rejects.toThrow('This issue is already tracking time');
    });

    it('should return TimeTrackingDTO if issue has never tracked time', async () => {
      // given
      const issueId = 'issueId';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      projectStageRepositoryMock.getByProjectIdAndStageId.mockResolvedValue(mockProjectStageDTOStarted);
      eventRepositoryMock.getLastTimeTrackingEvent.mockResolvedValue(null);
      const validEvent: TimeTrackingDTO = {
        id: 'eventId',
        issueId: mockIssueDTO.id,
        startTime: new Date(),
        endTime: null,
      };
      eventRepositoryMock.createTimeTrackingEvent.mockResolvedValue(validEvent);

      // when
      const result = await issueService.resumeTimer(issueId);

      // then
      expect(result).toBe(validEvent);
    });

    it('should return TimeTrackingDTO if issue is legally resumed', async () => {
      // given
      const issueId = 'issueId';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      projectStageRepositoryMock.getByProjectIdAndStageId.mockResolvedValue(mockProjectStageDTOStarted);
      const validEvent: TimeTrackingDTO = {
        id: 'eventId',
        issueId: mockIssueDTO.id,
        startTime: new Date(),
        endTime: new Date(),
      };
      eventRepositoryMock.getLastTimeTrackingEvent.mockResolvedValue(validEvent);
      const newValidEvent: TimeTrackingDTO = {
        id: 'newEventId',
        issueId: mockIssueDTO.id,
        startTime: new Date(),
        endTime: null,
      };
      eventRepositoryMock.createTimeTrackingEvent.mockResolvedValue(newValidEvent);

      // when
      const result = await issueService.resumeTimer(issueId);

      // then
      expect(result).toBe(newValidEvent);
    });
  });
});
