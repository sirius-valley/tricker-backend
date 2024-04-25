import { matchesAtLeastOneError, retry } from '@utils/retry';
import { Logger } from '@utils';

describe('retry', () => {
  Logger.disable();
  it('should retry the operation on failure and succeed after a few retries', async () => {
    // Mock operation that fails twice and then succeeds
    const mockOperation = jest.fn().mockRejectedValueOnce(new Error('Failed')).mockRejectedValueOnce(new Error('Failed again')).mockResolvedValue('Success');

    const result = await retry(mockOperation, { retries: 3, delay: 10 }, []);

    expect(mockOperation).toHaveBeenCalledTimes(3); // Ensure retries
    expect(result).toBe('Success'); // Assert successful result
  });

  it('should stop retrying after a specific error', async () => {
    const mockError = new SomeSpecificError('Stop retrying');
    const mockOperation = jest.fn().mockRejectedValueOnce(new SomeSpecificError('Failed')).mockRejectedValueOnce(mockError);

    try {
      await retry(mockOperation, { retries: 3, delay: 10 }, [SomeSpecificError]);
    } catch (e: any) {
      expect(e).toBeInstanceOf(SomeSpecificError); // Assert failure with specific error
    }

    expect(mockOperation).toHaveBeenCalledTimes(1); // Ensure stopping after 1 retry
  });

  it('should throw the original error if retries are exhausted', async () => {
    const mockError = new OtherSpecificError('Original error');
    const mockOperation = jest.fn().mockRejectedValue(mockError);

    try {
      await retry(mockOperation, { retries: 2, delay: 10 }, []);
    } catch (e: any) {
      expect(e).toBeInstanceOf(OtherSpecificError); // Assert failure with specific error
    }

    expect(mockOperation).toHaveBeenCalledTimes(3); // Ensure retries
  });

  it('should match errors for stopping retrying', () => {
    const error1 = new SomeSpecificError('Error 1');

    expect(matchesAtLeastOneError(error1, [OtherSpecificError])).toBe(false); // Different errors
    expect(matchesAtLeastOneError(error1, [SomeSpecificError])).toBe(true); // Same error
  });
});

class SomeSpecificError extends Error {}

class OtherSpecificError extends Error {}
