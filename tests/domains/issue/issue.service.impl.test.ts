import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { issueRepositoryMock, eventRepositoryMock } from './mock';
import { ConflictException, NotFoundException } from '@utils';
import { mockIssueDTO, negativeMockManualTimeModification, stoppedMockTimeTrackingDTO, validMockManualTimeModification } from './mockData';

describe('issue service tests', () => {
  let issueService: IssueService;

  beforeEach(() => {
    jest.resetAllMocks();
    issueService = new IssueServiceImpl(issueRepositoryMock, eventRepositoryMock);
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
      const receivedSeconds: number = await issueService.getIssueWorkedSeconds(issueId);
      // then
      expect.assertions(1);
      expect(receivedSeconds).toEqual(expectedSeconds);
    });

    it('should return zero seconds when no tracking events or manual changes performed', async (): Promise<void> => {
      // given
      const issueId: string = 'issue789';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      eventRepositoryMock.getIssueTimeTrackingEvents.mockResolvedValue([]);
      eventRepositoryMock.getIssueManualTimeModification.mockResolvedValue([]);
      const expectedSeconds: number = 0;
      // when
      const receivedSeconds: number = await issueService.getIssueWorkedSeconds(issueId);
      // then
      expect.assertions(1);
      expect(receivedSeconds).toEqual(expectedSeconds);
    });

    it('should throw NotFoundException when issue is null', async (): Promise<void> => {
      // given
      const wrongIssueId: string = 'wrongIssueId';
      // when
      issueRepositoryMock.getById.mockResolvedValue(null);
      // assert
      expect.assertions(2);
      await expect(issueService.getIssueWorkedSeconds(wrongIssueId)).rejects.toThrow(NotFoundException);
      await expect(issueService.getIssueWorkedSeconds(wrongIssueId)).rejects.toThrow("Not found. Couldn't find Issue");
    });

    it('should throw ConflictException when worked time is not a positive value', async () => {
      // given
      const issueId: string = 'issue789';
      issueRepositoryMock.getById.mockResolvedValue(mockIssueDTO);
      eventRepositoryMock.getIssueTimeTrackingEvents.mockResolvedValue([stoppedMockTimeTrackingDTO]);
      eventRepositoryMock.getIssueManualTimeModification.mockResolvedValue([negativeMockManualTimeModification]);

      // assert
      expect.assertions(2);
      await expect(issueService.getIssueWorkedSeconds(issueId)).rejects.toThrow(ConflictException);
      await expect(issueService.getIssueWorkedSeconds(issueId)).rejects.toThrow('Conflict. Worked time have to be a positive value');
    });
  });
});
