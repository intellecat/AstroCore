import { getHouses } from './ephemeris.js';
import { HouseSystem, HouseCusp, ChartAngles, ZODIAC_SIGNS } from './types.js';

export function calculateHousesAndAngles(
  jd: number,
  lat: number,
  lng: number,
  system: HouseSystem = HouseSystem.Placidus
): { houses: HouseCusp[]; angles: ChartAngles } {
  
  let safeLat = lat;
  if (safeLat > 66.0) safeLat = 66.0;
  if (safeLat < -66.0) safeLat = -66.0;

  const result = getHouses(jd, safeLat, lng, system);

  const houses: HouseCusp[] = [];
  for (let i = 1; i <= 12; i++) {
    const absPos = result.cusps[i];
    const signIndex = Math.floor(absPos / 30) % 12;
    const signData = ZODIAC_SIGNS[signIndex];
    
    houses.push({
      house: i,
      degree: absPos % 30,
      longitude: absPos,
      sign: signData.name,
      emoji: signData.emoji
    });
  }

  const angles: ChartAngles = {
    Asc: result.ascendant,
    MC: result.mc,
    Dsc: (result.ascendant + 180) % 360,
    IC: (result.mc + 180) % 360,
    Vertex: result.vertex
  };

  return { houses, angles };
}
