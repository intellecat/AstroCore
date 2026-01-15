import { describe, it, expect } from 'vitest';
import { calculateCompositeChart } from '../src/core/composite.js';
import { BodyId, ChartData } from '../src/core/types.js';

describe('Composite Charts', () => {
  it('calculates midpoints correctly', () => {
    const mockChartA: Partial<ChartData> = {
      bodies: [
        { id: BodyId.Sun, longitude: 0, degree: 0, sign: 'Aries', house: 1 } as any
      ],
      houses: Array(12).fill(0).map((_, i) => ({ house: i + 1, longitude: i * 30, degree: 0, sign: '', emoji: '' }))
    };

    const mockChartB: Partial<ChartData> = {
      bodies: [
        { id: BodyId.Sun, longitude: 20, degree: 20, sign: 'Aries', house: 1 } as any
      ],
      houses: Array(12).fill(0).map((_, i) => ({ house: i + 1, longitude: i * 30 + 10, degree: 10, sign: '', emoji: '' }))
    };

    const composite = calculateCompositeChart(mockChartA as ChartData, mockChartB as ChartData);

    const sun = composite.bodies?.find(b => b.id === BodyId.Sun);
    expect(sun?.longitude).toBe(10);
    expect(composite.houses?.[0].longitude).toBe(5);
  });

  it('handles the 360/0 crossover in midpoints', () => {
    const mockChartA: Partial<ChartData> = {
      bodies: [{ id: BodyId.Sun, longitude: 350 } as any],
      houses: Array(12).fill({ longitude: 0 })
    };
    const mockChartB: Partial<ChartData> = {
      bodies: [{ id: BodyId.Sun, longitude: 10 } as any],
      houses: Array(12).fill({ longitude: 0 })
    };

    const composite = calculateCompositeChart(mockChartA as ChartData, mockChartB as ChartData);
    const sun = composite.bodies?.find(b => b.id === BodyId.Sun);
    expect(sun?.longitude).toBe(0);
  });
});