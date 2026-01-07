import { polarToCartesian } from '../geometry.js';
import { ZODIAC_SIGNS } from '../../core/types.js';

export function drawZodiacWheel(
  cx: number,
  cy: number,
  radius: number,
  rotationOffset: number
): string {
  let svg = '<g id="zodiac-wheel">';

  // Draw Background Circles
  svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.2" />`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${radius - 40}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.2" />`;

  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const sign = ZODIAC_SIGNS[i];
    
    const p1 = polarToCartesian(cx, cy, radius, angle, rotationOffset);
    const p2 = polarToCartesian(cx, cy, radius - 40, angle, rotationOffset);
    svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="var(--astro-color-text)" stroke-opacity="0.2" />`;
    
    const midAngle = angle + 15;
    const glyphPos = polarToCartesian(cx, cy, radius - 20, midAngle, rotationOffset);
    
    // Direct Unicode Text
    svg += `<text x="${glyphPos.x}" y="${glyphPos.y}" 
                  font-size="22" 
                  text-anchor="middle" 
                  dominant-baseline="central" 
                  fill="var(--astro-color-text)">${sign.emoji}</text>`;
  }

  svg += '</g>';
  return svg;
}