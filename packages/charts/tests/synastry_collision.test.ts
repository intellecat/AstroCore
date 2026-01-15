import { describe, it, expect } from 'vitest';
import { resolveSynastryCollisions } from '../src/visuals/collision_synastry.js';
import { CelestialPosition, BodyId } from '@astrologer/astro-core';

describe('Synastry Collision Resolver', () => {
  it('stacks close planets radially', () => {
    // Two planets at same degree
    const planets: Partial<CelestialPosition>[] = [
      { id: BodyId.Sun, longitude: 100 },
      { id: BodyId.Moon, longitude: 100 }
    ];

    const adjusted = resolveSynastryCollisions(planets as CelestialPosition[], 6);

    // Should have same(ish) longitude but different tracks
    expect(adjusted[0].adjustedLongitude).toBeCloseTo(100, 1);
    expect(adjusted[1].adjustedLongitude).toBeCloseTo(100, 1);
    
    // One should be offset
    expect(adjusted[0].radialOffset).not.toBe(adjusted[1].radialOffset);
  });

  it('spreads laterally if same track collides', () => {
    // Three planets at same degree.
    // Wrap check might force 2 into same track.
    const planets: Partial<CelestialPosition>[] = [
      { id: 'P1', longitude: 100 },
      { id: 'P2', longitude: 100 },
      { id: 'P3', longitude: 100 },
    ] as any as CelestialPosition[];

    const adjusted = resolveSynastryCollisions(planets as CelestialPosition[], 6);

    const p1 = adjusted[0];
    const p2 = adjusted[1];
    const p3 = adjusted[2];

    // Identify which track has 2 planets
    const track0 = adjusted.filter(p => p.radialOffset === 0);
    const track1 = adjusted.filter(p => p.radialOffset === 1);

    expect(track0.length + track1.length).toBe(3);
    
    // The track with 2 planets must be spread
    const crowdedTrack = track0.length > track1.length ? track0 : track1;
    expect(crowdedTrack.length).toBe(2);
    
    const dist = Math.abs(crowdedTrack[0].adjustedLongitude - crowdedTrack[1].adjustedLongitude);
    expect(dist).toBeGreaterThan(5); // Lateral spread applied
  });
});