import { DateTime } from 'luxon';
import { getJulianDay } from '../utils/time.js';
import { getBodyPosition } from './ephemeris.js';
import { BodyId } from './types.js';

/**
 * Calculates the exact moment (Julian Day) a planet returns to a specific longitude.
 * @param body The body (Sun, Moon, etc)
 * @param targetLongitude Natal longitude
 * @param approximateDate Start searching from here
 * @returns Precise Julian Day
 */
export function calculatePlanetaryReturn(
  body: BodyId,
  targetLongitude: number,
  approximateDate: Date | string | DateTime
): number {
  let jd = getJulianDay(approximateDate);
  let iteration = 0;
  const maxIterations = 20;
  const precision = 0.00001; // degrees

  while (iteration < maxIterations) {
    const pos = getBodyPosition(body, jd);
    let diff = targetLongitude - pos.longitude;
    
    // Normalize diff to -180 to 180
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < precision) {
      break;
    }

    // Adjust JD based on speed
    // speed is degrees per day
    const step = diff / pos.longitudeSpeed;
    jd += step;
    iteration++;
  }

  return jd;
}
