import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { issueRepositoryMock, eventRepositoryMock } from './mock';
import { ConflictException, NotFoundException } from '@utils';
import { mockIssueDTO, stoppedMockTimeTrackingDTO, validMockManualTimeModification, invalidMockTimeTrackingDTO } from './mockData';
import { type WorkedTimeDTO } from '@domains/issue/dto';

describe('issue service tests', () => {
  let issueService: IssueService;

  beforeEach(() => {
    jest.resetAllMocks();
    issueService = new IssueServiceImpl(issueRepositoryMock, eventRepositoryMock);
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
});
