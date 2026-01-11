import { Point } from '../geometry.js';

export type MarkerRenderer = (start: Point, target: Point, length: number, color?: string) => string;

/**
 * Default implementation: A straight line (sloping if needed) of fixed length.
 */
export function drawLineMarker(start: Point, target: Point, length: number, color: string = 'var(--astro-color-text)'): string {
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist === 0) return '';

  const ratio = length / dist;

  const endX = start.x + dx * ratio;
  const endY = start.y + dy * ratio;

  return `<line x1="${start.x}" y1="${start.y}" 
                x2="${endX}" y2="${endY}" 
                stroke="${color}" 
                stroke-width="0.8" 
                stroke-opacity="0.6" />`;
}
