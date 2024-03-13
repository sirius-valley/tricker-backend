import { getTimeTrackedInSeconds } from '@utils/date-service';
import { ConflictException } from '@utils';

describe('date-service tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getIssueWorkedSeconds method', () => {
    it('should return a positive value if no end time provided', async (): Promise<void> => {
      // given
      const startDate: Date = new Date('2024-03-12T09:00:00Z');
      // when
      const receivedSeconds: number = getTimeTrackedInSeconds({ startDate, endDate: null });
      // then
      expect.assertions(1);
      expect(receivedSeconds).toBeGreaterThan(0);
    });

    it('should return a positive value under normal conditions', async (): Promise<void> => {
      // given
      const startDate: Date = new Date('2024-03-12T09:00:00Z');
      const endDate: Date = new Date('2024-03-12T10:00:00Z');
      const expectedSeconds: number = 3600;
      // when
      const receivedSeconds: number = getTimeTrackedInSeconds({ startDate, endDate });
      // then
      expect.assertions(1);
      expect(receivedSeconds).toEqual(expectedSeconds);
    });

    it('should throw ConflictException when worked time is not a positive value', async (): Promise<void> => {
      // given
      const endDate: Date = new Date('2024-03-12T09:00:00Z');
      const startDate: Date = new Date('2024-03-12T10:00:00Z');
      let result;
      // when
      try {
        result = getTimeTrackedInSeconds({ startDate, endDate });
      } catch (error) {
        result = error;
      }
      // then
      expect(result).toBeInstanceOf(ConflictException);
    });
  });
});
