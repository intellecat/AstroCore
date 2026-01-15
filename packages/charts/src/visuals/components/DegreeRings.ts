import { polarToCartesian } from '../geometry.js';

export interface DegreeRingsConfig {
  degreeRadius: number;
  tickSmall: number;
  tickMedium: number;
  tickLarge: number;
}

/**
 * Draws the 360 degree tick marks (Scales).
 */
export function drawDegreeRings(
  cx: number,
  cy: number,
  rotationOffset: number,
  config: DegreeRingsConfig
): string {
  let svg = '<g id="degree-rings">';

  for (let i = 0; i < 360; i++) {
    let tickLength = config.tickSmall;
    let className = 'astro-degree-tick';

    if (i % 10 === 0) {
      tickLength = config.tickLarge;
      className += ' major';
    } else if (i % 5 === 0) {
      tickLength = config.tickMedium;
      className += ' medium';
    }

    const p1 = polarToCartesian(cx, cy, config.degreeRadius, i, rotationOffset);
    const p2 = polarToCartesian(cx, cy, config.degreeRadius + tickLength, i, rotationOffset);

    svg += `<line x1="${p1.x}" y1="${p1.y}" 
                  x2="${p2.x}" y2="${p2.y}" 
                  class="${className}" />`;
  }

  svg += '</g>';
  return svg;
}
