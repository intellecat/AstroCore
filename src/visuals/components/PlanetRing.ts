import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId, HouseCusp } from '../../core/types.js';
import { resolveCollisions } from '../collision.js';
import { MarkerRenderer, drawLineMarker } from './Markers.js';

const UNICODE_MAP: Record<string, string> = {
  [BodyId.Sun]: '☉', [BodyId.Moon]: '☽', [BodyId.Mercury]: '☿', [BodyId.Venus]: '♀', [BodyId.Mars]: '♂',
  [BodyId.Jupiter]: '♃', [BodyId.Saturn]: '♄', [BodyId.Uranus]: '♅', [BodyId.Neptune]: '♆', [BodyId.Pluto]: '♇',
  [BodyId.Chiron]: '⚷', [BodyId.MeanNode]: '☊', [BodyId.TrueNode]: '☊', [BodyId.SouthNode]: '☋',
  [BodyId.LilithMean]: '⚸', [BodyId.LilithTrue]: '⚸', [BodyId.ParsFortunae]: '⊗',
  [BodyId.Vertex]: 'Vx', [BodyId.AntiVertex]: 'Av',
};

// Helper to convert BodyId to CSS class suffix
function getBodyClass(id: string): string {
    return 'astro-planet-' + id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export interface PlanetRingConfig {
    symbolRadius: number;
    degreeRadius: number;
    minuteRadius?: number; // Optional radius for minutes text
    tickStartRadius: number;
    tickLength: number;
    symbolSize?: number; 
    showMinutes?: boolean;
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
    
    // Always use Semantic Class
    const planetClass = getBodyClass(planet.id);

    const symPos = polarToCartesian(cx, cy, config.symbolRadius, adj.adjustedLongitude, rotationOffset);
    const markerStartPos = polarToCartesian(cx, cy, config.tickStartRadius, adj.originalLongitude, rotationOffset);

    // Draw Tick
    const markerSvg = markerRenderer(markerStartPos, symPos, config.tickLength, { x: cx, y: cy });

    let groupContent = '';
    
    // Marker
    groupContent += markerSvg;

    // Symbol
    groupContent += `<text x="${symPos.x}" y="${symPos.y}" 
                  font-size="${fontSize}"
                  class="astro-planet-symbol">${char}</text>`;
    
    // m/t indicators
    if (planet.id.includes('Mean') || planet.id.includes('True')) {
        const indicator = planet.id.includes('Mean') ? 'm' : 't';
        groupContent += `<text x="${symPos.x + 8}" y="${symPos.y - 8}" class="astro-planet-indicator">${indicator}</text>`;
    }

    // Degree Text
    const textPos = polarToCartesian(cx, cy, config.degreeRadius, adj.adjustedLongitude, rotationOffset);
    
    groupContent += `<text x="${textPos.x}" y="${textPos.y}" 
                  class="astro-planet-degree">${Math.floor(planet.degree)}°</text>`;

    // Minute Text (Optional)
    if (config.showMinutes) {
        const minuteVal = Math.floor((planet.degree % 1) * 60);
        const minR = config.minuteRadius ?? (config.degreeRadius > config.symbolRadius ? config.degreeRadius + 15 : config.degreeRadius - 15);
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