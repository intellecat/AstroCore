import { describe, it, expect } from 'vitest';
import { calculateDistribution } from '../src/analysis/distribution.js';
import { BodyId, CelestialPosition, ChartAngles } from '../src/core/types.js';

describe('Distribution Analysis', () => {
  it('correctly weights Sun, Moon and Ascendant', () => {
    const bodies: Partial<CelestialPosition>[] = [
      { id: BodyId.Sun, sign: 'Aries' }, // Fire, Cardinal (Weight 2.0)
      { id: BodyId.Moon, sign: 'Taurus' }, // Earth, Fixed (Weight 2.0)
      { id: BodyId.Mars, sign: 'Leo' }, // Fire, Fixed (Weight 1.5)
    ];

    const angles: Partial<ChartAngles> = {
        Asc: 250, // 250 is Sag (Fire, Mutable) (Weight 2.0)
        MC: 0,    // 0 is Aries (Fire, Cardinal) (Weight 1.5)
        Dsc: 70,  // 70 is Gemini (Air, Mutable) (Weight 1.5)
        IC: 180,  // 180 is Libra (Air, Cardinal) (Weight 1.5)
    };

    const score = calculateDistribution(bodies as CelestialPosition[], angles as ChartAngles);

    // Fire: Sun(2.0) + Mars(1.5) + Asc(2.0) + MC(1.5) = 7.0
    // Earth: Moon(2.0) = 2.0
    // Air: Dsc(1.5) + IC(1.5) = 3.0
    expect(score.elements.Fire).toBe(7.0);
    expect(score.elements.Earth).toBe(2.0);
    expect(score.elements.Air).toBe(3.0);
    expect(score.elements.Water).toBe(0);

    // Cardinal: Sun(2.0) + MC(1.5) + IC(1.5) = 5.0
    // Fixed: Moon(2.0) + Mars(1.5) = 3.5
    // Mutable: Asc(2.0) + Dsc(1.5) = 3.5
    expect(score.qualities.Cardinal).toBe(5.0);
    expect(score.qualities.Fixed).toBe(3.5);
    expect(score.qualities.Mutable).toBe(3.5);
  });
});