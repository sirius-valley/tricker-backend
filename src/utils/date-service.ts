import { differenceInSeconds } from 'date-fns';
import { ConflictException } from '@utils/errors';
import { type TimeTrackingDates } from '@domains/event/dto';

export const getTimeTrackedInSeconds = (dates: TimeTrackingDates): number => {
  const seconds: number = dates.endDate === null ? differenceInSeconds(new Date(), dates.startDate) : differenceInSeconds(dates.endDate, dates.startDate);
  if (seconds < 0) {
    throw new ConflictException('Worked time have to be a positive value');
  }

  return seconds;
};
