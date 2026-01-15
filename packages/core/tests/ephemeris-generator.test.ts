import { describe, it, expect } from 'vitest';
import { generateEphemerisRange } from '../src/ephemeris-generator.js';
import { HouseSystem } from '../src/core/types.js';

describe('Ephemeris Generator', () => {
  it('generates a range of steps', () => {
    const start = '2026-01-01T00:00:00Z';
    const end = '2026-01-03T00:00:00Z';
    const interval = { days: 1 };

    const steps = generateEphemerisRange({
      start,
      end,
      interval,
      location: { latitude: 51.5, longitude: 0 },
      houseSystem: HouseSystem.Placidus
    });

    // 2026-01-01, 01-02, 01-03
    expect(steps.length).toBe(3);
    expect(steps[0].date).toContain('2026-01-01');
    expect(steps[2].date).toContain('2026-01-03');
    expect(steps[0].bodies.length).toBeGreaterThan(10);
  });
});
