import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId } from '@astrologer/astro-core';
import { resolveSynastryCollisions } from '../collision_synastry.js';

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

export interface StackedRingLayout {
    symbolStartRadius: number; 
    orbitStep: number; 
    tickStartRadius: number;
    tickLength: number;
}

export function drawStackedPlanetRing(
  cx: number,
  cy: number,
  planets: CelestialPosition[],
  rotationOffset: number,
  layout: StackedRingLayout
): string {
  let svg = '<g class="stacked-planet-ring">';

  const adjusted = resolveSynastryCollisions(planets, 6);

  adjusted.forEach(adj => {
    const planet = planets.find(p => p.id === adj.id)!;
    const char = UNICODE_MAP[planet.id] || '?';
    
    const planetClass = getBodyClass(planet.id);
    
    const r = layout.symbolStartRadius - (adj.radialOffset * layout.orbitStep);
    const symPos = polarToCartesian(cx, cy, r, adj.adjustedLongitude, rotationOffset);
    
    const markerStartPos = polarToCartesian(cx, cy, layout.tickStartRadius, adj.originalLongitude, rotationOffset);
    const markerEndPos = polarToCartesian(cx, cy, layout.tickStartRadius - layout.tickLength, adj.originalLongitude, rotationOffset);

    // Group Content
    let groupContent = '';

    // Draw Tick
    groupContent += `<line x1="${markerStartPos.x}" y1="${markerStartPos.y}" 
                  x2="${markerEndPos.x}" y2="${markerEndPos.y}" 
                  class="astro-marker" />`;

    // Symbol
    groupContent += `<text x="${symPos.x}" y="${symPos.y}" 
                  font-size="18" 
                  class="astro-planet-symbol">${char}</text>`;
    
    if (planet.id.includes('Mean') || planet.id.includes('True')) {
        const indicator = planet.id.includes('Mean') ? 'm' : 't';
        groupContent += `<text x="${symPos.x + 7}" y="${symPos.y - 7}" font-size="7" class="astro-planet-indicator">${indicator}</text>`;
    }
    
    // Wrap in Semantic Group
    svg += `<g class="${planetClass}">${groupContent}</g>`;
  });

  svg += '</g>';
  return svg;
}
