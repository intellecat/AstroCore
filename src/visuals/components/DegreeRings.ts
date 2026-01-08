import { polarToCartesian } from '../geometry.js';
import { ChartLayout } from '../layout.js';

/**
 * Draws the 360 degree tick marks (Scales).
 */
export function drawDegreeRings(
  cx: number,
  cy: number,
  rotationOffset: number,
  layout: ChartLayout
): string {
  let svg = '<g id="degree-rings">';

  for (let i = 0; i < 360; i++) {
    let tickLength = layout.degreeTickSmall;
    let opacity = 0.2;

    if (i % 10 === 0) {
      tickLength = layout.degreeTickLarge;
      opacity = 0.5;
    } else if (i % 5 === 0) {
      tickLength = layout.degreeTickMedium;
      opacity = 0.3;
    }

    const p1 = polarToCartesian(cx, cy, layout.degreeRing, i, rotationOffset);
    const p2 = polarToCartesian(cx, cy, layout.degreeRing + tickLength, i, rotationOffset);

    svg += `<line x1="${p1.x}" y1="${p1.y}" 
                  x2="${p2.x}" y2="${p2.y}" 
                  stroke="var(--astro-color-text)" 
                  stroke-width="0.5" 
                  stroke-opacity="${opacity}" />`;
  }

  svg += '</g>';
  return svg;
}
