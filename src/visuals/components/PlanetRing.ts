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

const COLOR_MAP: Record<string, string> = {
  [BodyId.Sun]: 'var(--astro-color-sun)', [BodyId.Moon]: 'var(--astro-color-moon)', [BodyId.Mercury]: 'var(--astro-color-mercury)',
  [BodyId.Venus]: 'var(--astro-color-venus)', [BodyId.Mars]: 'var(--astro-color-mars)', [BodyId.Jupiter]: 'var(--astro-color-jupiter)',
  [BodyId.Saturn]: 'var(--astro-color-saturn)', [BodyId.Uranus]: 'var(--astro-color-uranus)', [BodyId.Neptune]: 'var(--astro-color-neptune)',
  [BodyId.Pluto]: 'var(--astro-color-pluto)', [BodyId.MeanNode]: 'var(--astro-color-mean-node)', [BodyId.TrueNode]: 'var(--astro-color-true-node)',
  [BodyId.LilithMean]: 'var(--astro-color-mean-lilith)', [BodyId.LilithTrue]: 'var(--astro-color-mean-lilith)',
};

export interface PlanetRingConfig {
    symbolRadius: number;
    degreeRadius: number;
    tickStartRadius: number;
    tickLength: number;
    markerColor?: string; // If set, overrides default text color. If 'PLANET', uses planet color.
}

export function drawPlanetRing(
  cx: number,
  cy: number,
  planets: CelestialPosition[],
  rotationOffset: number,
  config: PlanetRingConfig,
  options: { 
      houses?: HouseCusp[], // If provided, enables collision avoidance with houses
      markerRenderer?: MarkerRenderer
  } = {}
): string {
  let svg = '<g class="planet-ring">';

  // If houses are provided, use them for avoidance. Otherwise pass empty array (no avoidance).
  const houses = options.houses || [];
  const avoidHouses = houses.length > 0;
  
  // Reuse the robust resolver
  const adjusted = resolveCollisions(planets, houses, 6, 4, avoidHouses);

  const markerRenderer = options.markerRenderer || drawLineMarker;

  adjusted.forEach(adj => {
    const planet = planets.find(p => p.id === adj.id)!;
    const char = UNICODE_MAP[planet.id] || '?';
    const planetColor = COLOR_MAP[planet.id] || 'var(--astro-color-text)';
    
    // Determine marker color
    let markerColor = 'var(--astro-color-text)';
    if (config.markerColor === 'PLANET') {
        markerColor = planetColor;
    } else if (config.markerColor) {
        markerColor = config.markerColor;
    }

    const symPos = polarToCartesian(cx, cy, config.symbolRadius, adj.adjustedLongitude, rotationOffset);
    const markerStartPos = polarToCartesian(cx, cy, config.tickStartRadius, adj.originalLongitude, rotationOffset);

    // Draw Tick (Marker)
    // The renderer handles direction implicitly via start->target vector, but we only pass start and target here?
    // Wait, drawLineMarker calculates vector from start to target. 
    // If we want the tick to point TOWARDS the symbol, we pass target=symPos.
    svg += markerRenderer(markerStartPos, symPos, config.tickLength, markerColor);

    // Draw Symbol
    svg += `<text x="${symPos.x}" y="${symPos.y}" 
                  fill="${planetColor}" 
                  font-size="20" 
                  text-anchor="middle" 
                  dominant-baseline="central">${char}</text>`;
    
    // m/t indicators
    if (planet.id.includes('Mean') || planet.id.includes('True')) {
        const indicator = planet.id.includes('Mean') ? 'm' : 't';
        svg += `<text x="${symPos.x + 8}" y="${symPos.y - 8}" fill="${planetColor}" font-size="8">${indicator}</text>`;
    }

    // Degree Text
    const textPos = polarToCartesian(cx, cy, config.degreeRadius, adj.adjustedLongitude, rotationOffset);
    svg += `<text x="${textPos.x}" y="${textPos.y}" 
                  fill="${config.markerColor === 'PLANET' ? planetColor : 'var(--astro-color-text)'}" 
                  font-size="8" 
                  text-anchor="middle" 
                  dominant-baseline="middle" 
                  opacity="0.8">${Math.floor(planet.degree)}°</text>`;
  });

  svg += '</g>';
  return svg;
}
