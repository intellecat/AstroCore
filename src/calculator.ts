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
  aspectBodies?: BodyId[]; // New option
}

export function calculateChart(input: ChartInput): ChartData {
  // ... existing configuration logic ...
  let flags = CalculationFlag.Speed;
  
  if (input.zodiacType === ZodiacType.Sidereal) {
    flags |= CalculationFlag.Sidereal;
    configureSidereal(input.siderealMode ?? SiderealMode.FaganBradley);
  }

  const perspective = input.perspective || Perspective.Geocentric;
  if (perspective === Perspective.Heliocentric) {
    flags |= CalculationFlag.Heliocentric;
  } else if (perspective === Perspective.Topocentric) {
    flags |= CalculationFlag.Topocentric;
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

  // 5. Aspects (FILTERED)
  const defaultMainPlanets = [
    BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
    BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto
  ];
  
  const bodiesForAspects = input.aspectBodies 
    ? bodies.filter(b => input.aspectBodies!.includes(b.id))
    : bodies.filter(b => defaultMainPlanets.includes(b.id));

  const aspects = calculateAspects(bodiesForAspects);

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
      perspective,
      includeBodies: input.aspectBodies
    }
  };
}
