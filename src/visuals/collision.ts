import { CelestialPosition, HouseCusp } from '../core/types.js';

export function degreeDiff(d1: number, d2: number): number {
  let diff = Math.abs(d1 - d2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function norm(d: number): number {
    return (d + 360) % 360;
}

function clockwiseDist(d1: number, d2: number): number {
    return (d2 - d1 + 360) % 360;
}

export interface AdjustedPosition {
  id: string;
  originalLongitude: number;
  adjustedLongitude: number;
}

/**
 * Robust Global Collision Resolver.
 * Uses iterative repulsion while strictly enforcing circular order.
 */
export function resolveCollisions(
  planets: CelestialPosition[],
  houses: HouseCusp[],
  minDistance: number = 8,
  houseBuffer: number = 3.5
): AdjustedPosition[] {
  if (planets.length === 0) return [];

  // 1. Initial Setup: Circular Order is fixed by sorted original longitudes
  const data = [...planets]
    .sort((a, b) => a.longitude - b.longitude)
    .map(p => ({
        id: p.id,
        original: p.longitude,
        current: p.longitude
    }));

  const n = data.length;
  const iterations = 100; // High iterations for slow but stable convergence

  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;

    // A. Resolve Planet-to-Planet collisions
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const a = data[i];
      const b = data[j];

      const dist = clockwiseDist(a.current, b.current);
      if (dist < minDistance) {
        const overlap = minDistance - dist;
        const shift = overlap / 2 + 0.05; // Strong push
        
        a.current = norm(a.current - shift);
        b.current = norm(b.current + shift);
        moved = true;
      }
    }

    // B. Resolve House Cusp collisions
    for (let i = 0; i < n; i++) {
        const p = data[i];
        for (const house of houses) {
            let diff = Math.abs(p.current - house.longitude);
            if (diff > 180) diff = 360 - diff;

            if (diff < houseBuffer) {
                // If planet is clockwise of cusp, push CCW. Else push CW.
                const isCW = clockwiseDist(house.longitude, p.current) < 180;
                const shift = (houseBuffer - diff) + 0.1;
                p.current = norm(isCW ? p.current + shift : p.current - shift);
                moved = true;
            }
        }
    }

    // IMPORTANT: After every pass, ensure no planet "jumped" its neighbor
    // This is the absolute guarantee for parallel marker lines.
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const dist = clockwiseDist(data[i].current, data[j].current);
        if (dist > 180) { // Indicates a jump
            // Snap back to neighbor with min distance
            data[j].current = norm(data[i].current + minDistance);
            moved = true;
        }
    }

    if (!moved) break;
  }

  return data.map(d => ({
    id: d.id,
    originalLongitude: d.original,
    adjustedLongitude: d.current
  }));
}