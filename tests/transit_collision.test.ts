import { describe, it, expect } from 'vitest';
import { resolveCollisions } from '../src/visuals/collision.js';
import { CelestialPosition, BodyId } from '../src/core/types.js';

describe('Transit Collision Stability', () => {
  it('does not shift a solitary planet', () => {
    const planets: Partial<CelestialPosition>[] = [
      { id: BodyId.Sun, longitude: 100 }
    ];
    const houses: any[] = []; // No houses to avoid

    const adjusted = resolveCollisions(planets as CelestialPosition[], houses, 6, 4);
    
    // Should remain exactly at 100
    expect(adjusted[0].adjustedLongitude).toBeCloseTo(100, 5);
  });

  it('does not shift widely separated planets', () => {
    const planets: Partial<CelestialPosition>[] = [
      { id: BodyId.Sun, longitude: 100 },
      { id: BodyId.Moon, longitude: 200 }
    ];
    const houses: any[] = [];

    const adjusted = resolveCollisions(planets as CelestialPosition[], houses, 6, 4);
    
    expect(adjusted[0].adjustedLongitude).toBeCloseTo(100, 5);
    expect(adjusted[1].adjustedLongitude).toBeCloseTo(200, 5);
  });
});
