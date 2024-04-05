type AsyncOperation<T> = () => Promise<T>;
interface RetryOptions {
  retries: number;
  delay: number;
}
export const retry = async <ReturnType, ErrorType extends Error = Error>(operation: AsyncOperation<ReturnType>, options: RetryOptions, errorsToStop: Array<new (...args: any[]) => ErrorType>): Promise<ReturnType> => {
  try {
    return await operation();
  } catch (error: any) {
    if (options.retries > 0) {
      if (matchesAtLeastOneError(error, errorsToStop)) {
        throw error; // Throw the error if it matches the one to stop
      }
      await new Promise((resolve) => setTimeout(resolve, options.delay)); // Wait for the delay
      return retry(operation, { retries: options.retries - 1, delay: options.delay }, errorsToStop); // Retry the operation
    } else {
      throw error; // Throw the error if all retries are exhausted
    }
  }
};

export function matchesAtLeastOneError<ErrorType extends Error = Error>(error: ErrorType, errorTypes: Array<new (...args: any[]) => ErrorType>): boolean {
  // Loop through each error type in the array
  for (const errorType of errorTypes) {
    // Check if the error is an instance of the current error type
    if (error instanceof errorType) {
      return true; // Return true if match found
    }
  }
  return false; // Return false if no match found
}
