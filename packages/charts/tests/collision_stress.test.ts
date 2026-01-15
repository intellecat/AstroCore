import { describe, it, expect } from 'vitest';
import { calculateChart } from '@astrologer/astro-core';
import { resolveCollisions } from '../src/visuals/collision.js';
import { BodyId, GeoLocation } from '@astrologer/astro-core';

interface StressCase {
    name: string;
    date: string;
    location: GeoLocation;
}

const CASES: StressCase[] = [
    {
        name: 'Aquarius Cluster 2026',
        date: '2026-01-14T09:12:38.178Z',
        location: { latitude: 40.7128, longitude: -74.0060 }
    },
    {
        name: 'Taurus Stellium May 2000',
        date: '2000-05-03T12:00:00Z',
        location: { latitude: 51.5, longitude: 0.0 }
    },
    {
        name: 'Capricorn Stellium Jan 2020',
        date: '2020-01-12T12:00:00Z',
        location: { latitude: 40.7, longitude: -74.0 }
    },
    {
        name: 'Aquarius Stellium Feb 1962',
        date: '1962-02-05T07:00:00Z',
        location: { latitude: -3.0, longitude: 140.0 }
    }
];

describe('Collision Resolution Stress Test', () => {
  CASES.forEach(testCase => {
      it(`preserves visual order for ${testCase.name}`, () => {
        const chart = calculateChart({
            date: testCase.date,
            location: testCase.location
        });
        
        // Simulate outer ring (no house avoidance)
        const adjusted = resolveCollisions(chart.bodies, [], 6, 4, false);

        const sortedByOriginal = [...adjusted].sort((a, b) => a.originalLongitude - b.originalLongitude);
        const n = sortedByOriginal.length;

        for (let i = 0; i < n; i++) {
            const p1 = sortedByOriginal[i];
            const p2 = sortedByOriginal[(i + 1) % n];
            
            const adj1 = adjusted.find(a => a.id === p1.id)!;
            const adj2 = adjusted.find(a => a.id === p2.id)!;
            
            const d_orig = (p2.originalLongitude - p1.originalLongitude + 360) % 360;
            const d_adj = (adj2.adjustedLongitude - adj1.adjustedLongitude + 360) % 360;
            
            if (d_orig < 90) {
                expect(d_adj).toBeLessThan(180); 
            }
        }
      });
  });
});
