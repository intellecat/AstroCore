import { DateTime } from 'luxon';
import { dateToJulianDay } from '../core/swisseph.js';

/**
 * Calculates the Julian Day number for a given date.
 * Assumes the input date represents a Universal Time (UTC) moment.
 */
export function getJulianDay(date: string | Date | DateTime): number {
  let dt: DateTime;

  if (typeof date === 'string') {
    dt = DateTime.fromISO(date, { zone: 'utc' });
  } else if (date instanceof Date) {
    dt = DateTime.fromJSDate(date, { zone: 'utc' });
  } else if (date instanceof DateTime) {
    dt = date.toUTC();
  } else {
    throw new Error('Invalid date format');
  }

  if (!dt.isValid) {
    throw new Error(`Invalid date: ${dt.invalidReason}`);
  }

  return dateToJulianDay(dt.toJSDate());
}