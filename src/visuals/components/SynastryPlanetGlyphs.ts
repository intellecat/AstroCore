import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId } from '../../core/types.js';
import { resolveSynastryCollisions } from '../collision_synastry.js';
import { SynastryChartLayout } from '../synastry-layout.js';

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

export function drawSynastryPlanetGlyphs(
  cx: number,
  cy: number,
  planets: CelestialPosition[],
  isOuter: boolean, 
  rotationOffset: number,
  layout: SynastryChartLayout
): string {
  let svg = '<g class="synastry-planets">';

  const adjusted = resolveSynastryCollisions(planets, 6);

  const baseRadius = isOuter ? layout.outerPersonSymbol : layout.innerPersonSymbol;
  const orbitStep = isOuter ? layout.outerPersonOrbitStep : layout.innerPersonOrbitStep;
  const tickStartRadius = isOuter ? layout.outerPersonTickStart : layout.innerPersonTickStart;
  const tickLen = isOuter ? layout.outerPersonTickLength : layout.innerPersonTickLength;

  adjusted.forEach(adj => {
    const planet = planets.find(p => p.id === adj.id)!;
    const char = UNICODE_MAP[planet.id] || '?';
    const color = COLOR_MAP[planet.id] || 'var(--astro-color-text)';
    
    // 1. Symbol Position (Collision Aware)
    const r = baseRadius - (adj.radialOffset * orbitStep);
    const symPos = polarToCartesian(cx, cy, r, adj.adjustedLongitude, rotationOffset);
    
    // 2. Simple Marker Logic (Non-sloping, Fixed Length)
    const markerStartPos = polarToCartesian(cx, cy, tickStartRadius, adj.originalLongitude, rotationOffset);
    const markerEndPos = polarToCartesian(cx, cy, tickStartRadius - tickLen, adj.originalLongitude, rotationOffset);

    // Draw Tick (Colored)
    svg += `<line x1="${markerStartPos.x}" y1="${markerStartPos.y}" 
                  x2="${markerEndPos.x}" y2="${markerEndPos.y}" 
                  stroke="${color}" 
                  stroke-width="1.5" 
                  stroke-opacity="0.8" />`;

    // Symbol
    svg += `<text x="${symPos.x}" y="${symPos.y}" 
                  fill="${color}" 
                  font-size="18" 
                  text-anchor="middle" 
                  dominant-baseline="central">${char}</text>`;
    
    if (planet.id.includes('Mean') || planet.id.includes('True')) {
        const indicator = planet.id.includes('Mean') ? 'm' : 't';
        svg += `<text x="${symPos.x + 7}" y="${symPos.y - 7}" fill="${color}" font-size="7">${indicator}</text>`;
    }
  });

  svg += '</g>';
  return svg;
}
