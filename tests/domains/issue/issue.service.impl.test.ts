import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { issueRepositoryMock, eventRepositoryMock, userRepositoryMock, projectRepositoryMock } from './mock';
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
  mockPMIssueFilterParameters,
  mockLogicallyDeletedUserDTO,
  mockTrickerBlockEventDTO,
  mockIssueDetailsDTO,
  mockIssueAddBlockerInput,
  mockTrickerUnBlockEventDTO,
} from './mockData';
import { type IssueViewDTO, type WorkedTimeDTO } from '@domains/issue/dto';
import { type BlockerStatusModificationDTO } from '@domains/event/dto';

describe('issue service tests', () => {
  let issueService: IssueService;

  beforeEach(() => {
    jest.resetAllMocks();
    issueService = new IssueServiceImpl(issueRepositoryMock, eventRepositoryMock, userRepositoryMock, projectRepositoryMock);
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
});
