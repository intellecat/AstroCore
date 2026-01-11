import { polarToCartesian } from '../geometry.js';
import { ZODIAC_SIGNS } from '../../core/types.js';

export interface ZodiacWheelConfig {
  outerRadius: number;
  innerRadius: number;
  symbolRadius: number;
}

export function drawZodiacWheel(
  cx: number,
  cy: number,
  rotationOffset: number,
  config: ZodiacWheelConfig
): string {
  let svg = '<g id="zodiac-wheel">';

  // Use config radii for the rings
  svg += `<circle cx="${cx}" cy="${cy}" r="${config.outerRadius}" class="astro-zodiac-ring" />`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${config.innerRadius}" class="astro-zodiac-ring" />`;

  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const sign = ZODIAC_SIGNS[i];
    
    const p1 = polarToCartesian(cx, cy, config.outerRadius, angle, rotationOffset);
    const p2 = polarToCartesian(cx, cy, config.innerRadius, angle, rotationOffset);
    svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="astro-zodiac-line" />`;
    
    const midAngle = angle + 15;
    const glyphPos = polarToCartesian(cx, cy, config.symbolRadius, midAngle, rotationOffset);
    
    svg += `<text x="${glyphPos.x}" y="${glyphPos.y}" 
                  class="astro-zodiac-glyph">${sign.emoji}</text>`;
  }

  svg += '</g>';
  return svg;
}
