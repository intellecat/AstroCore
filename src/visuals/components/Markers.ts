import { Point } from '../geometry.js';
import { ChartLayout } from '../layout.js';

export type MarkerRenderer = (start: Point, target: Point, layout: ChartLayout) => string;

/**
 * Default implementation: A straight line (sloping if needed) of fixed length.
 */
export function drawLineMarker(start: Point, target: Point, layout: ChartLayout): string {
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist === 0) return '';

  const ratio = layout.planetTickLength / dist;

  const endX = start.x + dx * ratio;
  const endY = start.y + dy * ratio;

  return `<line x1="${start.x}" y1="${start.y}" 
                x2="${endX}" y2="${endY}" 
                stroke="var(--astro-color-text)" 
                stroke-width="0.8" 
                stroke-opacity="0.4" />`;
}
