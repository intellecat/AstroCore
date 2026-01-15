import { Point } from '../geometry.js';

/**
 * Draws a purely radial tick radiating from the start point.
 * Ignores any lateral shift in the target (non-sloping).
 */
export function drawSimpleMarker(
  start: Point, 
  target: Point, 
  length: number,
  center: Point
): string {
  // Calculate true radial vector from center to start
  const vx = start.x - center.x;
  const vy = start.y - center.y;
  const distToStart = Math.sqrt(vx * vx + vy * vy);
  
  if (distToStart === 0) return '';

  // Determine if we should point "inward" or "outward" based on target's distance
  const targetVx = target.x - center.x;
  const targetVy = target.y - center.y;
  const distToTarget = Math.sqrt(targetVx * targetVx + targetVy * targetVy);
  
  const direction = distToTarget < distToStart ? -1 : 1;

  // Normalized radial vector * length * direction
  const dx = (vx / distToStart) * length * direction;
  const dy = (vy / distToStart) * length * direction;

  return `<line x1="${start.x}" y1="${start.y}" 
                x2="${start.x + dx}" y2="${start.y + dy}" 
                class="astro-marker" />`;
}
