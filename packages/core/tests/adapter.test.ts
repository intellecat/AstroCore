import { describe, it, expect, vi } from 'vitest';
import { setSwissEphemeris, dateToJulianDay } from '../src/core/swisseph.js';

describe('Swiss Ephemeris Adapter', () => {
  it('should throw an error if engine is not set', () => {
    // Force reset engine to null for this test (since other tests might have set it via setup.ts)
    setSwissEphemeris(null as any);
    
    expect(() => {
      dateToJulianDay(new Date());
    }).toThrow('Swiss Ephemeris engine not set');
  });

  it('should correctly delegate calls to the injected engine', () => {
    const mockEngine = {
      dateToJulianDay: vi.fn().mockReturnValue(2451545.0),
      calculatePosition: vi.fn(),
      calculateHouses: vi.fn(),
    };

    setSwissEphemeris(mockEngine);
    
    const testDate = new Date('2000-01-01T12:00:00Z');
    const result = dateToJulianDay(testDate);

    expect(mockEngine.dateToJulianDay).toHaveBeenCalledWith(testDate);
    expect(result).toBe(2451545.0);
  });

  it('should allow switching the engine implementation', () => {
    const engine1 = { dateToJulianDay: () => 1 };
    const engine2 = { dateToJulianDay: () => 2 };

    setSwissEphemeris(engine1);
    expect(dateToJulianDay(new Date())).toBe(1);

    setSwissEphemeris(engine2);
    expect(dateToJulianDay(new Date())).toBe(2);
  });
});