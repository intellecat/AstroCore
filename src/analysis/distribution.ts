import { CelestialPosition, BodyId, ChartAngles } from '../core/types.js';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Quality = 'Cardinal' | 'Fixed' | 'Mutable';

export interface DistributionScore {
  elements: Record<Element, number>;
  qualities: Record<Quality, number>;
}

export interface DistributionPercentage {
  elements: Record<Element, number>;
  qualities: Record<Quality, number>;
}

const SIGN_MAP: Record<string, { element: Element; quality: Quality }> = {
  Aries: { element: 'Fire', quality: 'Cardinal' },
  Taurus: { element: 'Earth', quality: 'Fixed' },
  Gemini: { element: 'Air', quality: 'Mutable' },
  Cancer: { element: 'Water', quality: 'Cardinal' },
  Leo: { element: 'Fire', quality: 'Fixed' },
  Virgo: { element: 'Earth', quality: 'Mutable' },
  Libra: { element: 'Air', quality: 'Cardinal' },
  Scorpio: { element: 'Water', quality: 'Fixed' },
  Sagittarius: { element: 'Fire', quality: 'Mutable' },
  Capricorn: { element: 'Earth', quality: 'Cardinal' },
  Aquarius: { element: 'Air', quality: 'Fixed' },
  Pisces: { element: 'Water', quality: 'Mutable' },
};

const DEFAULT_WEIGHTS: Record<string, number> = {
    [BodyId.Sun]: 2.0,
    [BodyId.Moon]: 2.0,
    'Ascendant': 2.0,
    'Medium_Coeli': 1.5,
    'Descendant': 1.5,
    'Imum_Coeli': 1.5,
    [BodyId.Mercury]: 1.5,
    [BodyId.Venus]: 1.5,
    [BodyId.Mars]: 1.5,
    [BodyId.Jupiter]: 1.0,
    [BodyId.Saturn]: 1.0,
    [BodyId.Uranus]: 0.5,
    [BodyId.Neptune]: 0.5,
    [BodyId.Pluto]: 0.5,
    [BodyId.MeanNode]: 0.5,
    [BodyId.TrueNode]: 0.5,
    [BodyId.Chiron]: 0.6,
};

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

function getSign(longitude: number): string {
  return SIGNS[Math.floor(longitude / 30) % 12];
}

/**
 * Calculates weighted distribution of elements and qualities.
 */
export function calculateDistribution(
  bodies: CelestialPosition[],
  angles: ChartAngles,
  customWeights?: Record<string, number>
): DistributionScore {
  const score: DistributionScore = {
    elements: { Fire: 0, Earth: 0, Air: 0, Water: 0 },
    qualities: { Cardinal: 0, Fixed: 0, Mutable: 0 },
  };

  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // Helper to add points
  const addPoints = (sign: string, weight: number) => {
    const data = SIGN_MAP[sign];
    if (data) {
      score.elements[data.element] += weight;
      score.qualities[data.quality] += weight;
    }
  };

  // 1. Process Bodies
  for (const body of bodies) {
    const weight = weights[body.id] ?? 1.0;
    addPoints(body.sign, weight);
  }

  // 2. Process Angles (using house cusps/angles)
  addPoints(getSign(angles.Asc), weights['Ascendant'] ?? 1.5);
  addPoints(getSign(angles.MC), weights['Medium_Coeli'] ?? 1.5);
  addPoints(getSign(angles.Dsc), weights['Descendant'] ?? 1.5);
  addPoints(getSign(angles.IC), weights['Imum_Coeli'] ?? 1.5);

  return score;
}

/**
 * Calculates the combined distribution of two charts for synastry analysis.
 * Returns percentages.
 */
export function calculateSynastryDistribution(
    bodiesA: CelestialPosition[],
    anglesA: ChartAngles,
    bodiesB: CelestialPosition[],
    anglesB: ChartAngles,
    customWeights?: Record<string, number>
): DistributionPercentage {
    const scoreA = calculateDistribution(bodiesA, anglesA, customWeights);
    const scoreB = calculateDistribution(bodiesB, anglesB, customWeights);

    const combined: DistributionScore = {
        elements: { Fire: 0, Earth: 0, Air: 0, Water: 0 },
        qualities: { Cardinal: 0, Fixed: 0, Mutable: 0 },
    };

    let totalElements = 0;
    let totalQualities = 0;

    for (const key of ['Fire', 'Earth', 'Air', 'Water'] as Element[]) {
        combined.elements[key] = scoreA.elements[key] + scoreB.elements[key];
        totalElements += combined.elements[key];
    }

    for (const key of ['Cardinal', 'Fixed', 'Mutable'] as Quality[]) {
        combined.qualities[key] = scoreA.qualities[key] + scoreB.qualities[key];
        totalQualities += combined.qualities[key];
    }

    const percentages: DistributionPercentage = {
        elements: { Fire: 0, Earth: 0, Air: 0, Water: 0 },
        qualities: { Cardinal: 0, Fixed: 0, Mutable: 0 },
    };

    for (const key of ['Fire', 'Earth', 'Air', 'Water'] as Element[]) {
        percentages.elements[key] = totalElements > 0 ? (combined.elements[key] / totalElements) * 100 : 0;
    }

    for (const key of ['Cardinal', 'Fixed', 'Mutable'] as Quality[]) {
        percentages.qualities[key] = totalQualities > 0 ? (combined.qualities[key] / totalQualities) * 100 : 0;
    }

    return percentages;
}