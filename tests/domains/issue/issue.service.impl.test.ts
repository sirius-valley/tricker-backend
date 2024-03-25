import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { issueRepositoryMock, eventRepositoryMock, userRepositoryMock, projectRepositoryMock, projectStageRepositoryMock } from './mock';
import { ConflictException, ForbiddenException, NotFoundException } from '@utils';
import {
  mockPMIssueFilterParameters,
  mockLogicallyDeletedUserDTO,
  mockIssueDTO,
  stoppedMockTimeTrackingDTO,
  validMockManualTimeModification,
  invalidMockTimeTrackingDTO,
  mockUserDTO,
  mockProjectDTO,
  mockIssueViewDTO,
  mockNotRegisteredUserDTO,
  mockTrickerBlockEventDTO,
  mockIssueDetailsDTO,
  mockIssueAddBlockerInput,
  mockTrickerUnBlockEventDTO,
  mockAddManualTimeModificationEventInput,
  mockRemoveManualTimeModificationEventInput,
  validMockTimeTrackingDTO,
  mockIssueDTOWithoutStage,
  mockProjectStageDTO,
  mockProjectStageDTOStarted,
  mockDevIssueFilterParameters,
  mockIssueChangeLogDTO,
  mockAssigneeIssueChangeLogDTO,
  mockIssueExtendedDTO,
} from './mockData';
import { type IssueExtendedDTO, type IssueViewDTO, type WorkedTimeDTO } from '@domains/issue/dto';
import { type BlockerStatusModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';

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
      issueRepositoryMock.getWithFilters.mockResolvedValue([mockIssueViewDTO]);
      const expectedArray: IssueViewDTO[] = [mockIssueViewDTO];
      // when
      const receivedArray: IssueViewDTO[] = await issueService.getPMIssuesFilteredAndPaginated(mockPMIssueFilterParameters);
      // then
      expect.assertions(2);
      expect(receivedArray.length).toEqual(expectedArray.length);
      expect(receivedArray[0].id).toEqual(expectedArray[0].id);
    });
  });

  describe('blockIssueWithTrickerUI method', () => {
    it('should successfully generate the blocking event and change Issue status', async (): Promise<void> => {
      // given
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      eventRepositoryMock.createIssueBlockEvent.mockResolvedValue(mockTrickerBlockEventDTO);
      issueRepositoryMock.updateIsBlocked.mockResolvedValue(mockIssueDetailsDTO);

      const expected: BlockerStatusModificationDTO = mockTrickerBlockEventDTO;
      // when
      const received: BlockerStatusModificationDTO = await issueService.blockIssueWithTrickerUI(mockIssueAddBlockerInput);
      // then
      expect.assertions(2);
      expect(received.reason).toEqual(expected.reason);
      expect(received.comment).toEqual(expected.comment);
    });

    it('should throw NotFoundException when user id is not correct', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getByCognitoId.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, userCognitoId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, userCognitoId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when user is deleted user', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getByCognitoId.mockResolvedValue({ ...mockNotRegisteredUserDTO, deletedAt: new Date() });
      // then
      expect.assertions(2);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, userCognitoId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, userCognitoId: wrongUserId })).rejects.toThrow("Not found. Couldn't find User");
    });

    it('should throw NotFoundException when issue has been logically deleted', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getById.mockResolvedValue({ ...mockIssueDTO, deletedAt: new Date() });
      // then
      expect.assertions(2);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, issueId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, issueId: wrongUserId })).rejects.toThrow("Not found. Couldn't find Issue");
    });

    it('should throw NotFoundException when issue is null', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getById.mockResolvedValue(null);
      // then
      expect.assertions(2);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, issueId: wrongUserId })).rejects.toThrow(NotFoundException);
      await expect(issueService.blockIssueWithTrickerUI({ ...mockIssueAddBlockerInput, issueId: wrongUserId })).rejects.toThrow("Not found. Couldn't find Issue");
    });

    it('should throw ConflictException when issue is already blocked', async (): Promise<void> => {
      // given
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getById.mockResolvedValue({ ...mockIssueDTO, isBlocked: true });

      // then
      expect.assertions(1);
      await expect(issueService.blockIssueWithTrickerUI(mockIssueAddBlockerInput)).rejects.toThrow(ConflictException);
    });

    it('should throw ForbiddenException when user is not the owner of the issue', async (): Promise<void> => {
      // given - when
      const wrongUserId = 'wrongId';
      userRepositoryMock.getByCognitoId.mockResolvedValue({ ...mockUserDTO, id: wrongUserId });
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      // then
      expect.assertions(1);
      await expect(issueService.blockIssueWithTrickerUI(mockIssueAddBlockerInput)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('unblockIssueWithTrickerUI method', () => {
    it('should successfully generate the blocking event and change Issue status', async (): Promise<void> => {
      // given
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getById.mockResolvedValue({ ...mockIssueDTO, isBlocked: true });
      eventRepositoryMock.createIssueBlockEvent.mockResolvedValue(mockTrickerUnBlockEventDTO);
      issueRepositoryMock.updateIsBlocked.mockResolvedValue({ ...mockIssueDetailsDTO, isBlocked: false });
      // when
      const received: BlockerStatusModificationDTO = await issueService.unblockIssueWithTrickerUI(mockIssueAddBlockerInput);
      // then
      expect.assertions(1);
      expect(received.reason).toEqual('Unblocked by user John Doe');
    });

    it('should throw ConflictException when issue is already unblocked', async (): Promise<void> => {
      // given
      userRepositoryMock.getByCognitoId.mockResolvedValue(mockUserDTO);
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);

      // then
      expect.assertions(1);
      await expect(issueService.unblockIssueWithTrickerUI(mockIssueAddBlockerInput)).rejects.toThrow(ConflictException);
    });
  });

  describe('add/remove time method', () => {
    it('should create manual time modification event', async () => {
      // given
      const input = mockAddManualTimeModificationEventInput;
      const workedTime = 100; // Example worked time

      issueRepositoryMock.getById.mockResolvedValueOnce(mockIssueDTO);
      const getIssueWorkedSecondsSpy = jest.spyOn(issueService, 'getIssueWorkedSeconds').mockResolvedValueOnce({ workedTime });
      eventRepositoryMock.createManualTimeModification.mockResolvedValueOnce(validMockManualTimeModification);

      // when
      const result = await issueService.createManualTimeTracking(mockAddManualTimeModificationEventInput);

      // then
      expect(issueRepositoryMock.getById).toHaveBeenCalledWith(input.issueId);
      expect(getIssueWorkedSecondsSpy).toHaveBeenCalledWith(input.issueId);
      expect(eventRepositoryMock.createManualTimeModification).toHaveBeenCalledWith(input);
      expect(result).toEqual(validMockManualTimeModification);
    });

    it('should throw NotFoundException if issue not found', async () => {
      // given
      const input = mockAddManualTimeModificationEventInput;
      issueRepositoryMock.getById.mockResolvedValueOnce(null);

      // when
      const result = issueService.createManualTimeTracking(mockAddManualTimeModificationEventInput);

      // then
      await expect(result).rejects.toThrow(NotFoundException);
      expect(issueRepositoryMock.getById).toHaveBeenCalledWith(input.issueId);
    });

    it('should throw ConflictException if subtracting time exceeds total worked time', async () => {
      // given
      const input = mockRemoveManualTimeModificationEventInput;
      const workedTime = 100; // Example worked time
      issueRepositoryMock.getById.mockResolvedValueOnce(mockIssueDTO);
      const getIssueWorkedSecondsSpy = jest.spyOn(issueService, 'getIssueWorkedSeconds').mockResolvedValueOnce({ workedTime });

      // when
      const result = issueService.createManualTimeTracking(input);

      // then
      await expect(result).rejects.toThrow(ConflictException);
      expect(issueRepositoryMock.getById).toHaveBeenCalledWith(input.issueId);
      expect(getIssueWorkedSecondsSpy).toHaveBeenCalledWith(input.issueId);
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

  describe('getIssueWithChronology method', () => {
    it('should successfully return an IssueExtendedDTO', async (): Promise<void> => {
      // given
      issueRepositoryMock.getIssueDetailsById.mockResolvedValue(mockIssueDetailsDTO);
      eventRepositoryMock.getIssueBlockEvents.mockResolvedValue([mockTrickerBlockEventDTO]);
      eventRepositoryMock.getIssueChangeLogs.mockResolvedValue([mockIssueChangeLogDTO, mockAssigneeIssueChangeLogDTO]);
      eventRepositoryMock.getIssueManualTimeModification.mockResolvedValue([{ ...validMockManualTimeModification, modificationDate: new Date('2024-03-13T09:00:00Z') }]);
      eventRepositoryMock.getIssueTimeTrackingEvents.mockResolvedValue([stoppedMockTimeTrackingDTO]);
      const expected: IssueExtendedDTO = mockIssueExtendedDTO;
      // when
      const received: IssueExtendedDTO = await issueService.getIssueWithChronology('issue789');
      // then
      expect.assertions(3);
      expect(received.chronology.length).toEqual(6);
      expect(received.chronology[0].message).toEqual(expected.chronology[0].message);
      expect(received.chronology[5].date).toEqual(expected.chronology[5].date);
    });

    it('should throw NotFoundException if issue does not exist', async () => {
      // given - when
      const issueId = 'nonexistentIssueId';
      issueRepositoryMock.getIssueDetailsById.mockResolvedValue(null);
      // then
      await expect(issueService.getIssueWithChronology(issueId)).rejects.toThrow(NotFoundException);
    });
  });
});
