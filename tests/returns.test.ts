import { describe, it, expect } from 'vitest';
import { calculatePlanetaryReturn } from '../src/core/returns.js';
import { BodyId } from '../src/core/types.js';
import { getBodyPosition } from '../src/core/ephemeris.js';

describe('Planetary Returns', () => {
  it('finds the correct solar return moment', () => {
    const natalSunLong = 280.0; // Approx 10 deg Cap
    const approximateDate = '2027-01-01T12:00:00Z'; // One year later

    const returnJd = calculatePlanetaryReturn(BodyId.Sun, natalSunLong, approximateDate);
    
    // Verify the position at that JD
    const pos = getBodyPosition(BodyId.Sun, returnJd);
    expect(pos.longitude).toBeCloseTo(natalSunLong, 4);
  });
});