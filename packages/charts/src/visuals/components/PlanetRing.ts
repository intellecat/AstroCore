import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId, HouseCusp, ZODIAC_SIGNS } from '@astrologer/astro-core';
import { resolveCollisions } from '../collision.js';
import { MarkerRenderer, drawLineMarker } from './Markers.js';

const UNICODE_MAP: Record<string, string> = {
  [BodyId.Sun]: '☉', [BodyId.Moon]: '☽', [BodyId.Mercury]: '☿', [BodyId.Venus]: '♀', [BodyId.Mars]: '♂',
  [BodyId.Jupiter]: '♃', [BodyId.Saturn]: '♄', [BodyId.Uranus]: '♅', [BodyId.Neptune]: '♆', [BodyId.Pluto]: '♇',
  [BodyId.Chiron]: '⚷', [BodyId.MeanNode]: '☊', [BodyId.TrueNode]: '☊', [BodyId.SouthNode]: '☋',
  [BodyId.LilithMean]: '⚸', [BodyId.LilithTrue]: '⚸', [BodyId.ParsFortunae]: '⊗',
  [BodyId.Vertex]: 'Vx', [BodyId.AntiVertex]: 'Av',
};

function getBodyClass(id: string): string {
    return 'astro-planet-' + id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export interface PlanetRingConfig {
    symbolRadius: number;
    degreeRadius: number;
    minuteRadius?: number; 
    zodiacSignRadius?: number; 
    tickStartRadius: number;
    tickLength: number;
    symbolSize?: number; 
    showMinutes?: boolean;
    showZodiacSign?: boolean;
}

export function drawPlanetRing(
  cx: number,
  cy: number,
  planets: CelestialPosition[],
  rotationOffset: number,
  config: PlanetRingConfig,
  options: { 
      houses?: HouseCusp[], 
      markerRenderer?: MarkerRenderer
  } = {}
): string {
  let svg = '<g class="planet-ring">';

  const houses = options.houses || [];
  const avoidHouses = houses.length > 0;
  const adjusted = resolveCollisions(planets, houses, 6, 4, avoidHouses);

  const markerRenderer = options.markerRenderer || drawLineMarker;
  const fontSize = config.symbolSize ?? 20;

  adjusted.forEach(adj => {
    const planet = planets.find(p => p.id === adj.id)!;
    const char = UNICODE_MAP[planet.id] || '?';
    const planetClass = getBodyClass(planet.id);

    const symPos = polarToCartesian(cx, cy, config.symbolRadius, adj.adjustedLongitude, rotationOffset);
    const markerStartPos = polarToCartesian(cx, cy, config.tickStartRadius, adj.originalLongitude, rotationOffset);

    // Marker/Tick
    const markerSvg = markerRenderer(markerStartPos, symPos, config.tickLength, { x: cx, y: cy });

    let groupContent = markerSvg;

    // Symbol
    groupContent += `<text x="${symPos.x}" y="${symPos.y}" 
                  font-size="${fontSize}"
                  class="astro-planet-symbol">${char}</text>`;
    
    // m/t indicators
    if (planet.id.includes('Mean') || planet.id.includes('True')) {
        const indicator = planet.id.includes('Mean') ? 'm' : 't';
        groupContent += `<text x="${symPos.x + 8}" y="${symPos.y - 8}" class="astro-planet-indicator">${indicator}</text>`;
    }

    // Retrograde Indicator (r)
    if (planet.isRetrograde) {
        groupContent += `<text x="${symPos.x + 6}" y="${symPos.y + 2}" font-size="0.6em" class="astro-planet-retrograde">r</text>`;
    }

    // Degree Text
    const textPos = polarToCartesian(cx, cy, config.degreeRadius, adj.adjustedLongitude, rotationOffset);
    groupContent += `<text x="${textPos.x}" y="${textPos.y}" 
                  class="astro-planet-degree">${Math.floor(planet.degree)}°</text>`;

    // Zodiac Sign (Optional)
    if (config.showZodiacSign) {
        const signData = ZODIAC_SIGNS.find(z => z.name === planet.sign);
        if (signData) {
             const signR = config.zodiacSignRadius ?? (config.degreeRadius > config.symbolRadius ? config.degreeRadius + 18 : config.degreeRadius - 18);
             const signPos = polarToCartesian(cx, cy, signR, adj.adjustedLongitude, rotationOffset);
             groupContent += `<text x="${signPos.x}" y="${signPos.y}" class="astro-planet-zodiac">${signData.emoji}</text>`;
        }
    }

    // Minute Text (Optional)
    if (config.showMinutes) {
        const minuteVal = Math.floor((planet.degree % 1) * 60);
        
        let defaultMinuteBase = config.degreeRadius;
        if (config.showZodiacSign) {
             defaultMinuteBase = config.zodiacSignRadius ?? (config.degreeRadius > config.symbolRadius ? config.degreeRadius + 18 : config.degreeRadius - 18);
        }
        
        const offset = (config.degreeRadius > config.symbolRadius) ? 18 : -18;
        const minR = config.minuteRadius ?? (defaultMinuteBase + offset);
        const minPos = polarToCartesian(cx, cy, minR, adj.adjustedLongitude, rotationOffset);
        
        groupContent += `<text x="${minPos.x}" y="${minPos.y}" 
                      class="astro-planet-minute">${minuteVal}'</text>`;
    }

    // Wrap in Semantic Group
    svg += `<g class="${planetClass}">${groupContent}</g>`;
  });

  svg += '</g>';
  return svg;
}