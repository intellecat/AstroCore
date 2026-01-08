import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId, HouseCusp } from '../../core/types.js';
import { resolveCollisions } from '../collision.js';
import { ChartLayout } from '../layout.js';
import { MarkerRenderer, drawLineMarker } from './Markers.js';

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
  layout: ChartLayout,
  markerRenderer: MarkerRenderer = drawLineMarker
): string {
  let svg = '<g id="planet-glyphs">';

  const adjusted = resolveCollisions(planets, houses, 6, 4);

  adjusted.forEach((adj) => {
    const planet = planets.find((p) => p.id === adj.id)!;
    const char = UNICODE_MAP[planet.id] || '?';
    const color = COLOR_MAP[planet.id] || 'var(--astro-color-text)';

    const symPos = polarToCartesian(cx, cy, layout.planetSymbol, adj.adjustedLongitude, rotationOffset);
    const markerStartPos = polarToCartesian(cx, cy, layout.planetTickStart, adj.originalLongitude, rotationOffset);

    // Use the abstracted marker renderer
    svg += markerRenderer(markerStartPos, symPos, layout);

    // Planet Symbol
    svg += `<text x="${symPos.x}" y="${symPos.y}" 
                  fill="${color}" 
                  font-size="20" 
                  text-anchor="middle" 
                  dominant-baseline="central">${char}</text>`;

    // m/t indicators
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
