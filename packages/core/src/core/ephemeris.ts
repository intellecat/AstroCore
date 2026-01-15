import { 
  calculatePosition, 
  calculateHouses, 
  dateToJulianDay,
  setSiderealMode,
  setTopocentric
} from '@swisseph/node';
import { 
  Planet, 
  Asteroid, 
  CalculationFlag,
  HouseSystem as SweHouseSystem
} from '@swisseph/core';
import { BodyId, GeoLocation, HouseSystem, SiderealMode } from './types.js';

// Mapping BodyId to SwissEph Integers
const BODY_MAP: Record<BodyId, number> = {
  [BodyId.Sun]: Planet.Sun,
  [BodyId.Moon]: Planet.Moon,
  [BodyId.Mercury]: Planet.Mercury,
  [BodyId.Venus]: Planet.Venus,
  [BodyId.Mars]: Planet.Mars,
  [BodyId.Jupiter]: Planet.Jupiter,
  [BodyId.Saturn]: Planet.Saturn,
  [BodyId.Uranus]: Planet.Uranus,
  [BodyId.Neptune]: Planet.Neptune,
  [BodyId.Pluto]: Planet.Pluto,
  [BodyId.MeanNode]: 10, // SE_MEAN_NODE
  [BodyId.TrueNode]: 11, // SE_TRUE_NODE
  [BodyId.SouthNode]: 10, // Dummy, will be offset from North Node
  [BodyId.LilithMean]: 12, // SE_MEAN_APOGEE
  [BodyId.LilithTrue]: 13, // SE_OSCU_APOGEE
  [BodyId.Vertex]: -1, // Special
  [BodyId.AntiVertex]: -1, // Special
  [BodyId.ParsFortunae]: -1, // Special
  [BodyId.Chiron]: Asteroid.Chiron,
};

interface SweCalcResult {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
  rectAscension?: number;
  declination?: number;
}

interface SweHouseResult {
  cusps: number[];
  ascendant: number;
  mc: number;
  armc: number;
  vertex: number;
  equatorialAscendant: number;
  coAscendant1: number;
  coAscendant2: number;
  polarAscendant: number;
}

/**
 * Configures the sidereal mode globally.
 */
export function configureSidereal(siderealMode: SiderealMode) {
  if (typeof setSiderealMode === 'function') {
    setSiderealMode(siderealMode, 0, 0);
  }
}

/**
 * Sets the topocentric coordinates for accurate perspective.
 */
export function configureTopocentric(geo: GeoLocation) {
  if (typeof setTopocentric === 'function') {
    setTopocentric(geo.longitude, geo.latitude, geo.altitude || 0);
  }
}

/**
 * Wraps SwissEph calculatePosition
 */
export function getBodyPosition(
  body: BodyId,
  jd: number,
  flags: number = CalculationFlag.Speed
): SweCalcResult {
  const bodyId = BODY_MAP[body];
  return calculatePosition(jd, bodyId, flags) as SweCalcResult;
}

/**
 * Wraps SwissEph calculateHouses
 */
export function getHouses(
  jd: number,
  lat: number,
  lng: number,
  system: HouseSystem
): SweHouseResult {
  // Cast local HouseSystem string to library HouseSystem (compatible strings)
  return calculateHouses(jd, lat, lng, system as unknown as SweHouseSystem) as unknown as SweHouseResult;
}

export { dateToJulianDay, CalculationFlag };
