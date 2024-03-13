import { differenceInSeconds } from 'date-fns';

export const getTimeTrackedInSeconds = (startTime: Date, endTime: Date | null): number => {
  return endTime === null ? differenceInSeconds(new Date(), startTime) : differenceInSeconds(endTime, startTime);
};
