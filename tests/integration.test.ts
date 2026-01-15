import { describe, it, expect } from 'vitest';
import { calculateChart } from '../src/calculator.js';
import { BodyId, HouseSystem } from '../src/core/types.js';

describe('AstroCore Integration', () => {
  it('calculates a basic chart for Greenwich', () => {
    const input = {
      date: '2026-01-01T12:00:00Z',
      location: {
        latitude: 51.48,
        longitude: 0.0
      },
      houseSystem: HouseSystem.Placidus
    };

    const chart = calculateChart(input);

    expect(chart).toBeDefined();
    expect(chart.bodies.length).toBeGreaterThan(0);
    expect(chart.houses.length).toBe(12);

    // Sun check
    const sun = chart.bodies.find(b => b.id === BodyId.Sun);
    expect(sun).toBeDefined();
    // Sun on Jan 1st should be in Capricorn (approx 280 degrees or 10 deg Cap)
    // 270 is Cap 0. Jan 1 is roughly 10 days after solstice (Dec 21 approx).
    // So roughly 280.
    expect(sun?.longitude).toBeGreaterThan(270); 
    expect(sun?.longitude).toBeLessThan(290);
    expect(sun?.sign).toBe('Capricorn');

    // Angles check
    expect(chart.angles.Asc).toBeDefined();
    expect(chart.angles.MC).toBeDefined();
  });

  it('accepts Date object input', () => {
    const input = {
      date: new Date('2026-01-01T12:00:00Z'),
      location: { latitude: 0, longitude: 0 }
    };
    const chart = calculateChart(input);
    expect(chart).toBeDefined();
  });

  it('throws error for invalid date string', () => {
    const input = {
      date: 'invalid-date',
      location: { latitude: 0, longitude: 0 }
    };
    expect(() => calculateChart(input)).toThrow(/Invalid date/);
  });
});