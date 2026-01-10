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
  svg += `<circle cx="${cx}" cy="${cy}" r="${config.outerRadius}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.2" />`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${config.innerRadius}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.2" />`;

  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const sign = ZODIAC_SIGNS[i];
    
    const p1 = polarToCartesian(cx, cy, config.outerRadius, angle, rotationOffset);
    const p2 = polarToCartesian(cx, cy, config.innerRadius, angle, rotationOffset);
    svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="var(--astro-color-text)" stroke-opacity="0.2" />`;
    
    const midAngle = angle + 15;
    const glyphPos = polarToCartesian(cx, cy, config.symbolRadius, midAngle, rotationOffset);
    
    svg += `<text x="${glyphPos.x}" y="${glyphPos.y}" 
                  font-size="22" 
                  text-anchor="middle" 
                  dominant-baseline="central" 
                  fill="var(--astro-color-text)">${sign.emoji}</text>`;
  }

  svg += '</g>';
  return svg;
}