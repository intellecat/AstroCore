import { polarToCartesian } from '../geometry.js';
import { Aspect, AspectType } from '../../core/types.js';

export interface AspectLinesConfig {
  radius: number; // The boundary radius where lines attach
  showAspectSymbol?: boolean; // Optional: Show symbol at midpoint
}

const ASPECT_GLYPHS: Record<AspectType, string> = {
  [AspectType.Conjunction]: '☌',
  [AspectType.Opposition]: '☍',
  [AspectType.Trine]: '△',
  [AspectType.Square]: '□',
  [AspectType.Sextile]: '⚹'
};

const ASPECT_CLASS_SUFFIX: Record<AspectType, string> = {
  [AspectType.Conjunction]: 'conj',
  [AspectType.Opposition]: 'opp',
  [AspectType.Trine]: 'trine',
  [AspectType.Square]: 'square',
  [AspectType.Sextile]: 'sextile'
};

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

    // Determine semantic class for coloring
    // We assume CSS handles colors via .astro-aspect-line.conj { stroke: var(--astro-color-aspect-conj) }
    // But currently theme.ts defines vars but base.css might not map them all perfectly.
    // Actually, `astro-base.css` has `.astro-aspect-line` but relies on inline `stroke` in previous implementation?
    // Let's check previous implementation.
    // It used `stroke="var(--astro-color-aspect-conj)"`.
    // I should preserve that or switch to classes. 
    // To match current architecture, I should use inline var or classes. 
    // Let's use inline var for the line as before, or switch to pure class if possible.
    // Switching to pure class is better for the theme refactor.
    
    const suffix = ASPECT_CLASS_SUFFIX[asp.type] || 'minor';
    const colorVar = `--astro-color-aspect-${suffix}`;
    const glyph = ASPECT_GLYPHS[asp.type] || '';

    // Draw Line
    svg += `<line x1="${pt1.x}" y1="${pt1.y}" 
                  x2="${pt2.x}" y2="${pt2.y}" 
                  style="stroke: var(${colorVar})" 
                  class="astro-aspect-line" />`;

    // Draw Symbol (Optional)
    if (config.showAspectSymbol && glyph) {
        const mx = (pt1.x + pt2.x) / 2;
        const my = (pt1.y + pt2.y) / 2;
        
        svg += `<text x="${mx}" y="${my}" 
                      style="fill: var(${colorVar}); stroke: var(--astro-color-bg); stroke-width: 3px; paint-order: stroke fill;"
                      class="astro-aspect-symbol">${glyph}</text>`;
    }
  });

  svg += '</g>';
  return svg;
}
