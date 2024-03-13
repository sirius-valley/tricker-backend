import { getTimeTrackedInSeconds } from '@utils/date-service';

describe('date-service tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getIssueWorkedSeconds method', () => {
    it('should return a positive value if no end time provided', async (): Promise<void> => {
      // given
      const startTime: Date = new Date('2024-03-12T09:00:00Z');
      const endTime = null;
      const zeroSeconds: number = 0;
      // when
      const receivedSeconds: number = getTimeTrackedInSeconds(startTime, endTime);
      // then
      expect.assertions(1);
      expect(receivedSeconds).toBeGreaterThan(zeroSeconds);
    });

    it('should return a positive value under normal conditions', async (): Promise<void> => {
      // given
      const startTime: Date = new Date('2024-03-12T09:00:00Z');
      const endTime: Date = new Date('2024-03-12T10:00:00Z');
      const expectedSeconds: number = 3600;
      // when
      const receivedSeconds: number = getTimeTrackedInSeconds(startTime, endTime);
      // then
      expect.assertions(1);
      expect(receivedSeconds).toEqual(expectedSeconds);
    });

    it('should return a negative value if tracking time record is not valid', async (): Promise<void> => {
      // given
      const endTime: Date = new Date('2024-03-12T09:00:00Z');
      const startTime: Date = new Date('2024-03-12T10:00:00Z');
      const expectedSeconds: number = -3600;
      // when
      const receivedSeconds: number = getTimeTrackedInSeconds(startTime, endTime);
      // then
      expect.assertions(1);
      expect(receivedSeconds).toEqual(expectedSeconds);
    });
  });
});
