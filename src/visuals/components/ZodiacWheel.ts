import { polarToCartesian } from '../geometry.js';
import { ZODIAC_SIGNS } from '../../core/types.js';

export interface ZodiacWheelConfig {
  outerRadius: number;
  innerRadius: number;
  symbolRadius: number;
  showSignBackgrounds?: boolean;
}

/**
 * Generates an SVG path for an annular sector (arc with thickness).
 */
function describeArc(cx: number, cy: number, innerR: number, outerRadius: number, startAngle: number, endAngle: number, rotationOffset: number): string {
    const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle, rotationOffset);
    const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle, rotationOffset);
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle, rotationOffset);
    const innerEnd = polarToCartesian(cx, cy, innerR, endAngle, rotationOffset);

    // Large Arc Flag: 0 if angle difference < 180
    const largeArc = (endAngle - startAngle) <= 180 ? 0 : 1;

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
        `Z`
    ].join(" ");
}

export function drawZodiacWheel(
  cx: number,
  cy: number,
  rotationOffset: number,
  config: ZodiacWheelConfig
): string {
  let svg = '<g id="zodiac-wheel">';

  // 1. Background Arcs (Optional)
  if (config.showSignBackgrounds) {
      for (let i = 0; i < 12; i++) {
          const sign = ZODIAC_SIGNS[i];
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          const elementClass = sign.element.toLowerCase();
          
          const d = describeArc(cx, cy, config.innerRadius, config.outerRadius, startAngle, endAngle, rotationOffset);
          svg += `<path d="${d}" class="astro-zodiac-sign-bg ${elementClass}" />`;
      }
  }

  // 2. Main Rings
  svg += `<circle cx="${cx}" cy="${cy}" r="${config.outerRadius}" class="astro-zodiac-ring" />`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${config.innerRadius}" class="astro-zodiac-ring" />`;

  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const sign = ZODIAC_SIGNS[i];
    
    // Boundary Lines
    const p1 = polarToCartesian(cx, cy, config.outerRadius, angle, rotationOffset);
    const p2 = polarToCartesian(cx, cy, config.innerRadius, angle, rotationOffset);
    svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="astro-zodiac-line" />`;
    
    // Symbols
    const midAngle = angle + 15;
    const glyphPos = polarToCartesian(cx, cy, config.symbolRadius, midAngle, rotationOffset);
    
    svg += `<text x="${glyphPos.x}" y="${glyphPos.y}" 
                  class="astro-zodiac-glyph">${sign.emoji}</text>`;
  }

  svg += '</g>';
  return svg;
}