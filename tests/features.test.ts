import { describe, it, expect } from 'vitest';
import { calculateChart } from '../src/calculator.js';
import { BodyId, ZodiacType, SiderealMode } from '../src/core/types.js';

describe('New Features Compliance', () => {
  
  it('calculates Lunar Phase', () => {
    const input = {
      date: '2026-01-03T18:00:00Z', 
      location: { latitude: 0, longitude: 0 }
    };
    const chart = calculateChart(input);
    
    expect(chart.lunarPhase).toBeDefined();
    expect(chart.lunarPhase.phaseName).toBe('Full Moon');
    expect(chart.lunarPhase.illumination).toBeGreaterThan(0.95);
  });

  it('supports Sidereal Zodiac (Fagan-Bradley)', () => {
    const date = '2026-01-01T00:00:00Z';
    const loc = { latitude: 51.5, longitude: 0 };
    
    const tropical = calculateChart({ date, location: loc, zodiacType: ZodiacType.Tropical });
    const sunTrop = tropical.bodies.find(b => b.id === BodyId.Sun)!;

    const sidereal = calculateChart({ 
      date, 
      location: loc, 
      zodiacType: ZodiacType.Sidereal,
      siderealMode: SiderealMode.FaganBradley
    });
    const sunSid = sidereal.bodies.find(b => b.id === BodyId.Sun)!;

    expect(sunTrop.longitude).toBeGreaterThan(279);
    expect(sunSid.longitude).toBeLessThan(260);
    
    const diff = sunTrop.longitude - sunSid.longitude;
    expect(diff).toBeCloseTo(25, 0); 
  });

  it('supports Lahiri Ayanamsa (Sidereal)', () => {
    const date = '2026-01-01T00:00:00Z';
    const loc = { latitude: 51.5, longitude: 0 };
    
    const fagan = calculateChart({ 
      date, location: loc, zodiacType: ZodiacType.Sidereal, siderealMode: SiderealMode.FaganBradley 
    });
    const lahiri = calculateChart({ 
      date, location: loc, zodiacType: ZodiacType.Sidereal, siderealMode: SiderealMode.Lahiri 
    });

    const sunFagan = fagan.bodies.find(b => b.id === BodyId.Sun)!;
    const sunLahiri = lahiri.bodies.find(b => b.id === BodyId.Sun)!;

    expect(sunFagan.longitude).not.toBe(sunLahiri.longitude);
    const diff = Math.abs(sunFagan.longitude - sunLahiri.longitude);
    expect(diff).toBeGreaterThan(0.5);
    expect(diff).toBeLessThan(2.0);
  });

  it('detects Applying vs Separating aspects', () => {
    const chart = calculateChart({
      date: '2026-01-01T00:00:00Z',
      location: { latitude: 0, longitude: 0 }
    });
    
    expect(chart.aspects.length).toBeGreaterThan(0);
    const aspect = chart.aspects[0];
    expect(typeof aspect.isApplying).toBe('boolean');
  });

  it('calculates special points (Pars Fortunae, Lilith)', () => {
    const chart = calculateChart({
      date: '2026-01-01T12:00:00Z',
      location: { latitude: 51.5, longitude: 0 },
      bodies: [
        BodyId.Sun, 
        BodyId.Moon, 
        BodyId.MeanNode, 
        BodyId.ParsFortunae, 
        BodyId.LilithMean, 
        BodyId.SouthNode, 
        BodyId.Vertex
      ]
    });

    const pf = chart.bodies.find(b => b.id === BodyId.ParsFortunae);
    const lilith = chart.bodies.find(b => b.id === BodyId.LilithMean);
    const southNode = chart.bodies.find(b => b.id === BodyId.SouthNode);
    const vertex = chart.bodies.find(b => b.id === BodyId.Vertex);

    expect(pf).toBeDefined();
    expect(lilith).toBeDefined();
    expect(southNode).toBeDefined();
    expect(vertex).toBeDefined();
    
    const northNode = chart.bodies.find(b => b.id === BodyId.MeanNode)!;
    expect((northNode.longitude + 180) % 360).toBeCloseTo(southNode!.longitude, 5);
  });
});
