import { dayjs } from '@/utils/dayjs';

/**
 * Calculates the date range from August 1st of the previous year to July 31st of the target year.
 * @param targetEndYear The target ending year (if omitted, automatically determined based on current date).
 */
export function dateFrom1AugAgoTo31Jul(targetEndYear?: number) {
  const now = dayjs.tz();

  // If no year is provided:
  // - If the current month is August or later (0-indexed month >= 7), the cycle ends next year.
  // - Otherwise, the cycle ends in the current year.
  const endYear = targetEndYear ?? (now.month() >= 7 ? now.year() + 1 : now.year());
  const startYear = endYear - 1;

  // August 1st (startYear) at 00:00:00.000
  const startDate = dayjs
    .tz(`${startYear}-08-01`, 'Asia/Bangkok')
    .startOf('day')
    .toISOString();

  // July 31st (endYear) at 23:59:59.999
  const endDate = dayjs
    .tz(`${endYear}-07-31`, 'Asia/Bangkok')
    .endOf('day')
    .toISOString();

  return {
    startDate,
    endDate,
  };
}