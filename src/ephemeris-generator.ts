import { DateTime, DurationLike } from 'luxon';
import { calculatePlanets } from './core/planets.js';
import { calculateHousesAndAngles } from './core/houses.js';
import { getJulianDay } from './utils/time.js';
import { 
  CelestialPosition, 
  HouseCusp, 
  ChartAngles, 
  GeoLocation, 
  HouseSystem 
} from './core/types.js';

export interface EphemerisRangeInput {
  start: Date | string | DateTime;
  end: Date | string | DateTime;
  interval: DurationLike; // e.g. { days: 1 } or { hours: 6 }
  location: GeoLocation;
  houseSystem?: HouseSystem;
}

export interface EphemerisStep {
  date: string;
  jd: number;
  bodies: CelestialPosition[];
  houses: HouseCusp[];
  angles: ChartAngles;
}

/**
 * Generates a time-series of astrological data.
 */
export function generateEphemerisRange(input: EphemerisRangeInput): EphemerisStep[] {
  const steps: EphemerisStep[] = [];
  
  let current = input.start instanceof DateTime ? input.start : DateTime.fromISO(
    input.start instanceof Date ? input.start.toISOString() : input.start, 
    { zone: 'utc' }
  );
  
  const end = input.end instanceof DateTime ? input.end : DateTime.fromISO(
    input.end instanceof Date ? input.end.toISOString() : input.end, 
    { zone: 'utc' }
  );

  const system = input.houseSystem || HouseSystem.Placidus;

  while (current <= end) {
    const jd = getJulianDay(current);
    
    const { houses, angles } = calculateHousesAndAngles(
        jd, 
        input.location.latitude, 
        input.location.longitude, 
        system
    );
    
    const bodies = calculatePlanets(jd, houses, angles);

    steps.push({
      date: current.toISO()!,
      jd,
      bodies,
      houses,
      angles
    });

    current = current.plus(input.interval);
    
    // Safety break to prevent infinite loops if interval is 0 or negative
    if (steps.length > 10000) break; 
  }

  return steps;
}
