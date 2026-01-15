import { getBodyPosition, CalculationFlag } from './ephemeris.js';
import { BodyId, CelestialPosition, HouseCusp, ChartAngles, ZODIAC_SIGNS, DEFAULT_PLANETS } from './types.js';

function getSignData(longitude: number) {
  const index = Math.floor(((longitude + 360) % 360) / 30) % 12;
  return ZODIAC_SIGNS[index];
}

/**
 * Determines which house a longitude falls into.
 */
function getHousePlacement(longitude: number, cusps: HouseCusp[]): number {
  const lon = (longitude + 360) % 360;

  for (let i = 0; i < cusps.length; i++) {
    const currentCusp = cusps[i];
    const nextCusp = cusps[(i + 1) % cusps.length]; 

    const start = currentCusp.longitude;
    const end = nextCusp.longitude;

    if (start < end) {
      if (lon >= start && lon < end) return currentCusp.house;
    } else {
      if (lon >= start || lon < end) return currentCusp.house;
    }
  }
  return 1;
}

export function calculatePlanets(
  jd: number,
  houseCusps: HouseCusp[],
  angles: ChartAngles,
  flags: number = CalculationFlag.Speed,
  customBodies?: BodyId[]
): CelestialPosition[] {
  const bodies: CelestialPosition[] = [];
  const requested = new Set(customBodies || DEFAULT_PLANETS);

  // 1. Identify which standard bodies need calculation
  // (Either requested directly, or needed as dependency)
  const needsCalc = new Set<BodyId>();
  
  // Dependencies
  if (requested.has(BodyId.ParsFortunae)) {
      needsCalc.add(BodyId.Sun);
      needsCalc.add(BodyId.Moon);
  }
  if (requested.has(BodyId.SouthNode)) {
      needsCalc.add(BodyId.MeanNode);
  }

  // Add all requested standard bodies (that are not derived)
  const DERIVED = [BodyId.SouthNode, BodyId.Vertex, BodyId.AntiVertex, BodyId.ParsFortunae];
  requested.forEach(id => {
      if (!DERIVED.includes(id)) needsCalc.add(id);
  });

  // Cache for positions (to avoid recalculating if Sun is both requested and needed for Part)
  const posCache = new Map<BodyId, CelestialPosition>();

  // 2. Calculate Standard Bodies
  needsCalc.forEach(id => {
      const raw = getBodyPosition(id, jd, flags);
      const equatorial = getBodyPosition(id, jd, flags | CalculationFlag.Equatorial);
      const house = getHousePlacement(raw.longitude, houseCusps);
      const signData = getSignData(raw.longitude);

      const body = {
          id,
          name: id,
          degree: raw.longitude % 30,
          longitude: raw.longitude,
          latitude: raw.latitude,
          declination: equatorial.declination || 0,
          distance: raw.distance,
          speed: raw.longitudeSpeed,
          isRetrograde: raw.longitudeSpeed < 0,
          house,
          sign: signData.name,
          emoji: signData.emoji
      };
      
      posCache.set(id, body);
      
      // Add to result if explicitly requested
      if (requested.has(id)) bodies.push(body);
  });

  // 3. Helper for Special
  const addSpecial = (id: BodyId, longitude: number) => {
      if (!requested.has(id)) return;
      const signData = getSignData(longitude);
      bodies.push({
          id,
          name: id,
          degree: longitude % 30,
          longitude: longitude,
          latitude: 0,
          declination: 0,
          distance: 0,
          speed: 0,
          isRetrograde: false,
          house: getHousePlacement(longitude, houseCusps),
          sign: signData.name,
          emoji: signData.emoji
      });
  };

  // 4. Derived Bodies
  if (requested.has(BodyId.SouthNode) && posCache.has(BodyId.MeanNode)) {
      const meanNode = posCache.get(BodyId.MeanNode)!;
      addSpecial(BodyId.SouthNode, (meanNode.longitude + 180) % 360);
  }
  
  if (requested.has(BodyId.Vertex)) {
      addSpecial(BodyId.Vertex, angles.Vertex ?? 0);
  }
  if (requested.has(BodyId.AntiVertex)) {
      addSpecial(BodyId.AntiVertex, ((angles.Vertex ?? 0) + 180) % 360);
  }

  if (requested.has(BodyId.ParsFortunae) && posCache.has(BodyId.Sun) && posCache.has(BodyId.Moon)) {
      const sun = posCache.get(BodyId.Sun)!;
      const moon = posCache.get(BodyId.Moon)!;
      addSpecial(BodyId.ParsFortunae, (angles.Asc + moon.longitude - sun.longitude + 360) % 360);
  }

  return bodies;
}