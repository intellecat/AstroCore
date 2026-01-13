import { Point } from '../geometry.js';

export type MarkerRenderer = (start: Point, target: Point, length: number, center: Point) => string;

/**
 * Default implementation: A line pointing from start towards the target.
 * Slopes if the target is laterally shifted (collision resolution).
 */
export function drawLineMarker(start: Point, target: Point, length: number, center: Point): string {
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist === 0) return '';

  const ratio = length / dist;

  const endX = start.x + dx * ratio;
  const endY = start.y + dy * ratio;

  return `<line x1="${start.x}" y1="${start.y}" 
                x2="${endX}" y2="${endY}" 
                class="astro-marker" />`;
}