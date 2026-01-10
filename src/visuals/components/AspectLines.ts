import { polarToCartesian } from '../geometry.js';
import { Aspect, AspectType } from '../../core/types.js';

export interface AspectLinesConfig {
  radius: number; // The boundary radius where lines attach
}

export function drawAspectLines(
  cx: number,
  cy: number,
  aspects: Aspect[],
  rotationOffset: number,
  config: AspectLinesConfig
): string {
  let svg = '<g id="aspect-lines">';

  aspects.forEach(asp => {
    // Correctly use body1 and body2 longitudes
    const pt1 = polarToCartesian(cx, cy, config.radius, asp.body1.longitude, rotationOffset);
    const pt2 = polarToCartesian(cx, cy, config.radius, asp.body2.longitude, rotationOffset);

    let colorVar = '--astro-color-aspect-minor';
    switch (asp.type) {
      case AspectType.Conjunction: colorVar = '--astro-color-aspect-conj'; break;
      case AspectType.Opposition: colorVar = '--astro-color-aspect-opp'; break;
      case AspectType.Trine: colorVar = '--astro-color-aspect-trine'; break;
      case AspectType.Square: colorVar = '--astro-color-aspect-square'; break;
      case AspectType.Sextile: colorVar = '--astro-color-aspect-sextile'; break;
    }

    svg += `<line x1="${pt1.x}" y1="${pt1.y}" 
                  x2="${pt2.x}" y2="${pt2.y}" 
                  stroke="var(${colorVar})" 
                  stroke-width="1" 
                  stroke-opacity="0.6" />`;
  });

  svg += '</g>';
  return svg;
}
