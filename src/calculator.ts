import { DateTime } from 'luxon';
import { 
  configureSidereal, 
  configureTopocentric, 
  CalculationFlag 
} from './core/ephemeris.js';
import { calculatePlanets } from './core/planets.js';
import { calculateHousesAndAngles } from './core/houses.js';
import { calculateAspects } from './core/aspects.js';
import { calculateLunarPhase } from './core/moon.js';
import { getJulianDay } from './utils/time.js';
import { 
  ChartData, 
  GeoLocation, 
  HouseSystem, 
  ZodiacType,
  SiderealMode,
  Perspective,
  BodyId
} from './core/types.js';

export interface ChartInput {
  date: Date | string | DateTime;
  location: GeoLocation;
  houseSystem?: HouseSystem;
  zodiacType?: ZodiacType;
  siderealMode?: SiderealMode;
  perspective?: Perspective;
}

export function calculateChart(input: ChartInput): ChartData {
  // 1. Configure Flags & State
  let flags = CalculationFlag.Speed;
  
  if (input.zodiacType === ZodiacType.Sidereal) {
    flags |= CalculationFlag.Sidereal;
    // USE NEW API: Set specific Ayanamsa
    configureSidereal(input.siderealMode ?? SiderealMode.FaganBradley);
  }

  const perspective = input.perspective || Perspective.Geocentric;
  if (perspective === Perspective.Heliocentric) {
    flags |= CalculationFlag.Heliocentric;
  } else if (perspective === Perspective.Topocentric) {
    flags |= CalculationFlag.Topocentric;
    // USE NEW API: Set observer location for topocentric parallax
    configureTopocentric(input.location);
  }

  // 2. Time
  const jd = getJulianDay(input.date);
  const dateStr = typeof input.date === 'string' 
    ? input.date 
    : (input.date instanceof Date ? input.date.toISOString() : input.date.toISO() || '');

  // 3. Houses & Angles
  const system = input.houseSystem || HouseSystem.Placidus;
  const { houses, angles } = calculateHousesAndAngles(
    jd, 
    input.location.latitude, 
    input.location.longitude, 
    system
  );

  // 4. Planets
  const bodies = calculatePlanets(jd, houses, angles, flags);

  // 5. Aspects
  const aspects = calculateAspects(bodies);

  // 6. Lunar Phase
  const sun = bodies.find(b => b.id === BodyId.Sun);
  const moon = bodies.find(b => b.id === BodyId.Moon);
  const lunarPhase = calculateLunarPhase(
    sun ? sun.longitude : 0, 
    moon ? moon.longitude : 0
  );

  return {
    bodies,
    houses,
    angles,
    aspects,
    lunarPhase,
    meta: {
      date: dateStr,
      location: input.location,
      houseSystem: system,
      zodiacType: input.zodiacType || ZodiacType.Tropical,
      siderealMode: input.siderealMode,
      perspective
    }
  };
}
