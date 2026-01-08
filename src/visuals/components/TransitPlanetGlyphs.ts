import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId, HouseCusp } from '../../core/types.js';
import { resolveCollisions } from '../collision.js';
import { TransitChartLayout } from '../transit-layout.js';

const UNICODE_MAP: Record<string, string> = {
  [BodyId.Sun]: '☉', [BodyId.Moon]: '☽', [BodyId.Mercury]: '☿', [BodyId.Venus]: '♀', [BodyId.Mars]: '♂',
  [BodyId.Jupiter]: '♃', [BodyId.Saturn]: '♄', [BodyId.Uranus]: '♅', [BodyId.Neptune]: '♆', [BodyId.Pluto]: '♇',
  [BodyId.Chiron]: '⚷', [BodyId.MeanNode]: '☊', [BodyId.TrueNode]: '☊', [BodyId.SouthNode]: '☋',
  [BodyId.LilithMean]: '⚸', [BodyId.LilithTrue]: '⚸', [BodyId.ParsFortunae]: '⊗',
  [BodyId.Vertex]: 'Vx', [BodyId.AntiVertex]: 'Av',
};

// Transit color map (Orange theme)
const TRANSIT_COLOR = '#FF4500'; 

export function drawTransitPlanetGlyphs(
  cx: number,
  cy: number,
  planets: CelestialPosition[],
  houses: HouseCusp[], // Used for collision context if needed, but mainly we just need cusps
  rotationOffset: number,
  layout: TransitChartLayout
): string {
  let svg = '<g id="transit-planet-glyphs">';

  // Resolve collisions for the outer ring (No house avoidance)
  const adjusted = resolveCollisions(planets, houses, 6, 4, false);

  adjusted.forEach(adj => {
    const planet = planets.find(p => p.id === adj.id)!;
    const char = UNICODE_MAP[planet.id] || '?';
    
    // Symbol Position (Outer Ring)
    const symPos = polarToCartesian(cx, cy, layout.transitSymbol, adj.adjustedLongitude, rotationOffset);
    
    // Marker Start (Inner edge of transit ring / Outer edge of Zodiac)
    const markerStartPos = polarToCartesian(cx, cy, layout.transitTickStart, adj.originalLongitude, rotationOffset);

    // Marker vector (Radiating OUTWARDS)
    const dx = symPos.x - markerStartPos.x;
    const dy = symPos.y - markerStartPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // 10px tick length
    const ratio = layout.transitTickLength / dist;
    const markerEndPos = { 
        x: markerStartPos.x + dx * ratio, 
        y: markerStartPos.y + dy * ratio 
    };

    // Draw Tick
    svg += `<line x1="${markerStartPos.x}" y1="${markerStartPos.y}" 
                  x2="${markerEndPos.x}" y2="${markerEndPos.y}" 
                  stroke="${TRANSIT_COLOR}" stroke-width="1" stroke-opacity="0.6" />`;

    // Draw Symbol
    svg += `<text x="${symPos.x}" y="${symPos.y}" 
                  fill="${TRANSIT_COLOR}" 
                  font-size="18" 
                  text-anchor="middle" 
                  dominant-baseline="central">${char}</text>`;
    
    // Tiny degree text at the very edge
    const textPos = polarToCartesian(cx, cy, layout.transitDegree, adj.adjustedLongitude, rotationOffset);
    svg += `<text x="${textPos.x}" y="${textPos.y}" 
                  fill="${TRANSIT_COLOR}" font-size="7" 
                  text-anchor="middle" dominant-baseline="middle" opacity="0.8">${Math.floor(planet.degree)}°</text>`;
  });

  svg += '</g>';
  return svg;
}
