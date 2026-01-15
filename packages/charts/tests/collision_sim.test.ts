import { describe, it, expect } from 'vitest';
import { resolveCollisions, degreeDiff } from '../src/visuals/collision.js';
import { CelestialPosition, HouseCusp, BodyId } from '@astrologer/astro-core';

function clockwiseDist(d1: number, d2: number): number {
    return (d2 - d1 + 360) % 360;
}

describe('Collision Resolver Simulation', () => {
  const minDistance = 10;
  const houseBuffer = 4;

  const mockHouses: HouseCusp[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    longitude: i * 30,
    degree: 0,
    sign: '',
    emoji: ''
  }));

  it('verifies the user birthday Pisces cluster (High Density)', () => {
    // ♂ 16.59, ☊t 17.38, ☊m 18.20 (all in Pisces)
    const planets: Partial<CelestialPosition>[] = [
      { id: BodyId.Mars, longitude: 106.59 },
      { id: BodyId.TrueNode, longitude: 107.38 },
      { id: BodyId.MeanNode, longitude: 108.20 },
    ];

    const adjusted = resolveCollisions(planets as CelestialPosition[], mockHouses, minDistance, houseBuffer);

    // 1. Check Distance
    for (let i = 0; i < adjusted.length - 1; i++) {
        const d = clockwiseDist(adjusted[i].adjustedLongitude, adjusted[i+1].adjustedLongitude);
        expect(d).toBeGreaterThanOrEqual(minDistance - 0.1);
    }

    // 2. Check Order (Order should be Mars -> TrueNode -> MeanNode)
    const mars = adjusted.find(a => a.id === BodyId.Mars)!;
    const trueNode = adjusted.find(a => a.id === BodyId.TrueNode)!;
    const meanNode = adjusted.find(a => a.id === BodyId.MeanNode)!;

    expect(clockwiseDist(mars.adjustedLongitude, trueNode.adjustedLongitude)).toBeGreaterThan(0);
    expect(clockwiseDist(trueNode.adjustedLongitude, meanNode.adjustedLongitude)).toBeGreaterThan(0);
  });

  it('handles the 0/360 boundary (Aries Point crossover)', () => {
    const planets = [
      { id: 'P1', longitude: 358 },
      { id: 'P2', longitude: 2 },
    ] as any as CelestialPosition[];

    const adjusted = resolveCollisions(planets as CelestialPosition[], mockHouses, minDistance, houseBuffer);
    
    const p1 = adjusted.find(a => a.id === 'P1')!;
    const p2 = adjusted.find(a => a.id === 'P2')!;

    const d = clockwiseDist(p1.adjustedLongitude, p2.adjustedLongitude);
    expect(d).toBeGreaterThanOrEqual(minDistance - 0.1);
    
    // Ensure P1 is still "before" P2 in clockwise direction
    expect(clockwiseDist(p1.adjustedLongitude, p2.adjustedLongitude)).toBeLessThan(180);
  });

  it('ensures no symbols overlap house cusps', () => {
    const planets = [
      { id: 'OnCusp', longitude: 30.1 } // Right on 2nd house cusp
    ] as any as CelestialPosition[];

    const adjusted = resolveCollisions(planets as CelestialPosition[], mockHouses, minDistance, houseBuffer);
    const p = adjusted[0];

    const distToCusp = degreeDiff(p.adjustedLongitude, 30);
    expect(distToCusp).toBeGreaterThanOrEqual(houseBuffer - 0.1);
  });

  it('handles a Super Cluster (5 planets in 5 degrees)', () => {
    const planets = [
      { id: 'P1', longitude: 100 },
      { id: 'P2', longitude: 101 },
      { id: 'P3', longitude: 102 },
      { id: 'P4', longitude: 103 },
      { id: 'P5', longitude: 104 },
    ] as any as CelestialPosition[];

    const adjusted = resolveCollisions(planets as CelestialPosition[], mockHouses, 10, 4);

    // Check all gaps
    for (let i = 0; i < adjusted.length - 1; i++) {
        const d = clockwiseDist(adjusted[i].adjustedLongitude, adjusted[i+1].adjustedLongitude);
        expect(d, `Gap between ${adjusted[i].id} and ${adjusted[i+1].id}`).toBeGreaterThanOrEqual(9.9);
    }

    // Verify order
    expect(adjusted[0].id).toBe('P1');
    expect(adjusted[4].id).toBe('P5');
  });

  it('ensures global separation (no two planets on chart collide)', () => {
    // Two clusters that are far originally but pushed towards each other
    const planets = [
      { id: 'C1_P1', longitude: 100 },
      { id: 'C1_P2', longitude: 101 },
      { id: 'C2_P1', longitude: 115 },
      { id: 'C2_P2', longitude: 116 },
    ] as any as CelestialPosition[];

    // C1 width = 10. Center 100.5. Range [95.5, 105.5]
    // C2 width = 10. Center 115.5. Range [110.5, 120.5]
    // Separation between 105.5 and 110.5 is 5. Less than 10!
    
    const adjusted = resolveCollisions(planets as CelestialPosition[], mockHouses, 10, 4);

    const sortedResults = [...adjusted].sort((a, b) => a.adjustedLongitude - b.adjustedLongitude);
    for (let i = 0; i < sortedResults.length; i++) {
        const j = (i + 1) % sortedResults.length;
        const d = clockwiseDist(sortedResults[i].adjustedLongitude, sortedResults[j].adjustedLongitude);
        expect(d, `Global gap at index ${i}`).toBeGreaterThanOrEqual(9.9);
    }
  });
});
