import { describe, it, expect } from 'vitest';
import { calculateHouseOverlay, calculateRelationshipScore } from '../src/analysis/relationship.js';
import { BodyId } from '../src/core/types.js';

describe('Relationship Analysis', () => {
  it('correctly identifies house overlays', () => {
    const bodiesA = [
      { id: BodyId.Sun, longitude: 45, sign: 'Taurus' } as any 
    ];
    const housesB = [
      { house: 1, longitude: 0 },
      { house: 2, longitude: 30 },
      { house: 3, longitude: 60 },
    ].concat(Array(9).fill(0).map((_, i) => ({ house: i+4, longitude: 90 + i*30 }))) as any;

    const overlay = calculateHouseOverlay(bodiesA, housesB);
    expect(overlay[0].inHouseOfOther).toBe(2);
  });

  it('calculates a score based on advanced rules', () => {
    const bodiesA = [{ id: BodyId.Sun, longitude: 10, sign: 'Aries' }] as any;
    const bodiesB = [{ id: BodyId.Sun, longitude: 100, sign: 'Cancer' }] as any; 
    
    const result = calculateRelationshipScore(bodiesA, bodiesB);
    
    expect(result.isDestinySign).toBe(true);
    expect(result.score).toBeGreaterThan(10);
    expect(result.breakdown.length).toBeGreaterThan(0);
    expect(result.breakdown.some(b => b.rule === 'destiny_sign')).toBe(true);
  });
});
