import { Logger } from '@utils/logger';
import { lightFormat } from 'date-fns';

type AsyncOperation<T> = () => Promise<T>;
interface RetryOptions {
  retries: number;
  delay: number;
}

let initialRetries: number | undefined;

export const retry = async <ReturnType, ErrorType extends Error = Error>(operation: AsyncOperation<ReturnType>, options: RetryOptions, errorsToStop: Array<new (...args: any[]) => ErrorType>): Promise<ReturnType> => {
  if (initialRetries === undefined) {
    initialRetries = options.retries;
  }

  try {
    if (initialRetries === options.retries) {
      Logger.info({ prefix: '<<<retry function>>>', message: `Starting to retry... Retries left: ${options.retries}` });
    } else {
      Logger.info({ prefix: '<<<retry function>>>', message: `Retrying again... Retries left: ${options.retries}` });
    }
    return await operation();
  } catch (error: any) {
    Logger.fatal({ prefix: '<<<retry function>>>', message: error });
    if (options.retries > 0) {
      if (matchesAtLeastOneError(error, errorsToStop)) {
        Logger.fatal({ prefix: '<<<retry function>>>', message: 'Stopping retrying...' });
        throw error; // Throw the error if it matches the one to stop
      }
      Logger.info({ prefix: '<<<retry function>>>', message: `Retrying again at ${lightFormat(new Date(new Date().getMilliseconds() + options.delay), 'dd-MM-yyyy HH:mm:ss')}` });
      await new Promise((resolve) => setTimeout(resolve, options.delay)); // Wait for the delay
      return retry(operation, { retries: options.retries - 1, delay: options.delay }, errorsToStop); // Retry the operation
    } else {
      Logger.fatal({ prefix: '<<<retry function>>>', message: 'Stopping retrying...' });
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
