import { polarToCartesian } from '../geometry.js';
import { Aspect, AspectType } from '../../core/types.js';

export function drawAspectLines(
  cx: number,
  cy: number,
  radius: number,
  aspects: Aspect[],
  rotationOffset: number
): string {
  let svg = '<g id="aspect-lines">';

  aspects.forEach(asp => {
    const p1 = polarToCartesian(cx, cy, radius * 0.4, asp.body1.longitude, rotationOffset);
    const p2 = polarToCartesian(cx, cy, radius * 0.4, asp.body2.longitude, rotationOffset);

    let colorVar = '--astro-color-aspect-minor';
    switch (asp.type) {
      case AspectType.Conjunction: colorVar = '--astro-color-aspect-conj'; break;
      case AspectType.Opposition: colorVar = '--astro-color-aspect-opp'; break;
      case AspectType.Trine: colorVar = '--astro-color-aspect-trine'; break;
      case AspectType.Square: colorVar = '--astro-color-aspect-square'; break;
      case AspectType.Sextile: colorVar = '--astro-color-aspect-sextile'; break;
    }

    svg += `<line x1="${p1.x}" y1="${p1.y}" 
                  x2="${p2.x}" y2="${p2.y}" 
                  stroke="var(${colorVar})" 
                  stroke-width="1" 
                  stroke-opacity="0.6" />`;
    
    // Optional: draw aspect symbol in the middle
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    // We'd need to map aspect name to symbol ID
    // orb0, orb60, etc.
  });

  svg += '</g>';
  return svg;
}
