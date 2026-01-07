import { ChartData, CelestialPosition, HouseCusp, BodyId, ZODIAC_SIGNS } from './types.js';
import { calculateAspects } from './aspects.js';

function getMidpoint(l1: number, l2: number): number {
  let diff = l2 - l1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  let mid = l1 + diff / 2;
  return (mid + 360) % 360;
}

function getSignData(longitude: number) {
  const index = Math.floor(((longitude + 360) % 360) / 30) % 12;
  return ZODIAC_SIGNS[index];
}

export function calculateCompositeChart(chartA: ChartData, chartB: ChartData): Partial<ChartData> {
  const bodies: CelestialPosition[] = [];
  
  for (const bA of chartA.bodies) {
    const bB = chartB.bodies.find(b => b.id === bA.id);
    if (!bB) continue;

    const midLong = getMidpoint(bA.longitude, bB.longitude);
    const signData = getSignData(midLong);

    bodies.push({
      ...bA,
      degree: midLong % 30,
      longitude: midLong,
      sign: signData.name,
      emoji: signData.emoji,
      isRetrograde: false,
      speed: 0,
      house: 0 
    });
  }

  const houses: HouseCusp[] = [];
  for (let i = 0; i < 12; i++) {
    const cA = chartA.houses[i];
    const cB = chartB.houses[i];
    const midLong = getMidpoint(cA.longitude, cB.longitude);
    const signData = getSignData(midLong);

    houses.push({
      house: i + 1,
      degree: midLong % 30,
      longitude: midLong,
      sign: signData.name,
      emoji: signData.emoji
    });
  }

  for (const body of bodies) {
      body.house = getHousePlacement(body.longitude, houses);
  }

  const aspects = calculateAspects(bodies);

  return {
    bodies,
    houses,
    aspects,
    angles: {
        Asc: houses[0].longitude,
        MC: houses[9].longitude,
        Dsc: (houses[0].longitude + 180) % 360,
        IC: (houses[9].longitude + 180) % 360
    }
  };
}

function getHousePlacement(longitude: number, cusps: HouseCusp[]): number {
  for (let i = 0; i < cusps.length; i++) {
    const current = cusps[i];
    const next = cusps[(i + 1) % cusps.length];
    const start = current.longitude;
    const end = next.longitude;
    if (start < end) {
      if (longitude >= start && longitude < end) return current.house;
    } else {
      if (longitude >= start || longitude < end) return current.house;
    }
  }
  return 1;
}