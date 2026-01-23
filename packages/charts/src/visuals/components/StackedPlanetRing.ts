import { polarToCartesian } from '../geometry.js';
import { CelestialPosition, BodyId } from '@astrologer/astro-core';
import { resolveSynastryCollisions } from '../collision_synastry.js';
import { MarkerRenderer, drawRadialMarker } from './Markers.js';
import { drawPlanetSymbol } from './PlanetSymbol.js';

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
  layout: StackedRingLayout,
  options: { markerRenderer?: MarkerRenderer } = {}
): string {
  let svg = '<g class="stacked-planet-ring">';

  const adjusted = resolveSynastryCollisions(planets, 6);
  const markerRenderer = options.markerRenderer || drawRadialMarker;

  adjusted.forEach(adj => {
    const planet = planets.find(p => p.id === adj.id)!;
    
    const planetClass = getBodyClass(planet.id);
    
    const r = layout.symbolStartRadius - (adj.radialOffset * layout.orbitStep);
    const symPos = polarToCartesian(cx, cy, r, adj.adjustedLongitude, rotationOffset);
    
    const markerStartPos = polarToCartesian(cx, cy, layout.tickStartRadius, adj.originalLongitude, rotationOffset);
    
    // Group Content
    let groupContent = '';

    // Draw Tick using Renderer
    groupContent += markerRenderer(markerStartPos, symPos, layout.tickLength, { x: cx, y: cy });

    // Symbol using shared renderer
    groupContent += drawPlanetSymbol(planet, {
        x: symPos.x,
        y: symPos.y,
        fontSize: 18
    });
    
    // Wrap in Semantic Group
    svg += `<g class="${planetClass}">${groupContent}</g>`;
  });

  svg += '</g>';
  return svg;
}
