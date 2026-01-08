import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId, HouseCusp } from '../../core/types.js';
import { resolveCollisions } from '../collision.js';
import { ChartLayout } from '../layout.js';

const UNICODE_MAP: Record<string, string> = {
  [BodyId.Sun]: '☉',
  [BodyId.Moon]: '☽',
  [BodyId.Mercury]: '☿',
  [BodyId.Venus]: '♀',
  [BodyId.Mars]: '♂',
  [BodyId.Jupiter]: '♃',
  [BodyId.Saturn]: '♄',
  [BodyId.Uranus]: '♅',
  [BodyId.Neptune]: '♆',
  [BodyId.Pluto]: '♇',
  [BodyId.Chiron]: '⚷',
  [BodyId.MeanNode]: '☊',
  [BodyId.TrueNode]: '☊',
  [BodyId.SouthNode]: '☋',
  [BodyId.LilithMean]: '⚸',
  [BodyId.LilithTrue]: '⚸',
  [BodyId.ParsFortunae]: '⊗',
  [BodyId.Vertex]: 'Vx',
  [BodyId.AntiVertex]: 'Av',
};

const COLOR_MAP: Record<string, string> = {
  [BodyId.Sun]: 'var(--astro-color-sun)',
  [BodyId.Moon]: 'var(--astro-color-moon)',
  [BodyId.Mercury]: 'var(--astro-color-mercury)',
  [BodyId.Venus]: 'var(--astro-color-venus)',
  [BodyId.Mars]: 'var(--astro-color-mars)',
  [BodyId.Jupiter]: 'var(--astro-color-jupiter)',
  [BodyId.Saturn]: 'var(--astro-color-saturn)',
  [BodyId.Uranus]: 'var(--astro-color-uranus)',
  [BodyId.Neptune]: 'var(--astro-color-neptune)',
  [BodyId.Pluto]: 'var(--astro-color-pluto)',
  [BodyId.MeanNode]: 'var(--astro-color-mean-node)',
  [BodyId.TrueNode]: 'var(--astro-color-true-node)',
  [BodyId.LilithMean]: 'var(--astro-color-mean-lilith)',
  [BodyId.LilithTrue]: 'var(--astro-color-mean-lilith)',
};

export function drawPlanetGlyphs(
  cx: number,
  cy: number,
  planets: CelestialPosition[],
  houses: HouseCusp[],
  rotationOffset: number,
  layout: ChartLayout
): string {
  let svg = '<g id="planet-glyphs">';

  const adjusted = resolveCollisions(planets, houses, 6, 4);

  adjusted.forEach((adj) => {
    const planet = planets.find((p) => p.id === adj.id)!;
    const char = UNICODE_MAP[planet.id] || '?';
    const color = COLOR_MAP[planet.id] || 'var(--astro-color-text)';

    const symPos = polarToCartesian(cx, cy, layout.planetSymbol, adj.adjustedLongitude, rotationOffset);
    const markerStartPos = polarToCartesian(cx, cy, layout.planetTickStart, adj.originalLongitude, rotationOffset);

    // Calculate fixed length tick
    const dx = symPos.x - markerStartPos.x;
    const dy = symPos.y - markerStartPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ratio = layout.planetTickLength / dist;

    const markerEndPos = {
      x: markerStartPos.x + dx * ratio,
      y: markerStartPos.y + dy * ratio,
    };

    // Draw the sloping marker line
    svg += `<line x1="${markerStartPos.x}" y1="${markerStartPos.y}" 
                  x2="${markerEndPos.x}" y2="${markerEndPos.y}" 
                  stroke="var(--astro-color-text)" 
                  stroke-width="0.8" 
                  stroke-opacity="0.4" />`;

    // Planet Symbol
    svg += `<text x="${symPos.x}" y="${symPos.y}" 
                  fill="${color}" 
                  font-size="20" 
                  text-anchor="middle" 
                  dominant-baseline="central">${char}</text>`;

    // m/t indicators for Mean/True points
    if (planet.id.includes('Mean') || planet.id.includes('True')) {
      const indicator = planet.id.includes('Mean') ? 'm' : 't';
      svg += `<text x="${symPos.x + 8}" y="${symPos.y - 8}" fill="${color}" font-size="8">${indicator}</text>`;
    }

    // Degree Text
    const textPos = polarToCartesian(cx, cy, layout.planetDegree, adj.adjustedLongitude, rotationOffset);
    svg += `<text x="${textPos.x}" y="${textPos.y}" 
                  fill="var(--astro-color-text)" 
                  font-size="8" 
                  text-anchor="middle" 
                  dominant-baseline="middle" 
                  opacity="0.6">${Math.floor(planet.degree)}°</text>`;
  });

  svg += '</g>';
  return svg;
}