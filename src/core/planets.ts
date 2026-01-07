import { getBodyPosition, CalculationFlag } from './ephemeris.js';
import { BodyId, CelestialPosition, HouseCusp, ChartAngles, ZODIAC_SIGNS } from './types.js';

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
  flags: number = CalculationFlag.Speed
): CelestialPosition[] {
  const bodies: CelestialPosition[] = [];

  const standardIds = [
    BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
    BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto,
    BodyId.MeanNode, BodyId.TrueNode, BodyId.LilithMean, BodyId.LilithTrue, BodyId.Chiron
  ];

  for (const id of standardIds) {
    const raw = getBodyPosition(id, jd, flags);
    const equatorial = getBodyPosition(id, jd, flags | CalculationFlag.Equatorial);
    
    const house = getHousePlacement(raw.longitude, houseCusps);
    const signData = getSignData(raw.longitude);

    bodies.push({
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
    });
  }

  // Helper for special points
  const addSpecial = (id: BodyId, longitude: number) => {
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

  const meanNode = bodies.find(b => b.id === BodyId.MeanNode)!;
  addSpecial(BodyId.SouthNode, (meanNode.longitude + 180) % 360);
  addSpecial(BodyId.Vertex, angles.Vertex ?? 0);
  addSpecial(BodyId.AntiVertex, ((angles.Vertex ?? 0) + 180) % 360);
  
  const sun = bodies.find(b => b.id === BodyId.Sun)!;
  const moon = bodies.find(b => b.id === BodyId.Moon)!;
  addSpecial(BodyId.ParsFortunae, (angles.Asc + moon.longitude - sun.longitude + 360) % 360);

  return bodies;
}
