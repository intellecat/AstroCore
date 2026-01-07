import { CelestialPosition, HouseCusp, Aspect, AspectType, BodyId } from '../core/types.js';
import { calculateAspects, calculateDualAspects } from '../core/aspects.js';

export interface HouseOverlay {
  bodyId: string;
  inHouseOfOther: number;
}

export interface ScoreBreakdownItem {
  rule: string;
  description: string;
  points: number;
  details: string;
}

export interface RelationshipScore {
  score: number;
  description: string;
  isDestinySign: boolean;
  aspects: Aspect[];
  breakdown: ScoreBreakdownItem[];
}

const QUALITY_MAP: Record<string, 'Cardinal' | 'Fixed' | 'Mutable'> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

const DESTINY_SIGN_POINTS = 5;
const HIGH_PRECISION_ORBIT_THRESHOLD = 2; // degrees
const MAJOR_ASPECT_POINTS_HIGH = 11;
const MAJOR_ASPECT_POINTS_STD = 8;
const MINOR_ASPECT_POINTS = 4;
const SUN_ASC_POINTS = 4;
const MOON_ASC_POINTS = 4;
const VENUS_MARS_POINTS = 4;

const SCORE_THRESHOLDS = [
    { label: "Minimal", threshold: 5 },
    { label: "Medium", threshold: 10 },
    { label: "Important", threshold: 15 },
    { label: "Very Important", threshold: 20 },
    { label: "Exceptional", threshold: 30 },
    { label: "Rare Exceptional", threshold: Infinity },
];

/**
 * Calculates where planets of chart A fall into houses of chart B.
 */
export function calculateHouseOverlay(
  bodiesA: CelestialPosition[],
  housesB: HouseCusp[]
): HouseOverlay[] {
  return bodiesA.map(body => {
    const longitude = body.longitude;
    const house = getHouseForLongitude(longitude, housesB);
    return {
      bodyId: body.id,
      inHouseOfOther: house
    };
  });
}

function getHouseForLongitude(longitude: number, cusps: HouseCusp[]): number {
  const lon = (longitude + 360) % 360;
  for (let i = 0; i < cusps.length; i++) {
    const current = cusps[i];
    const next = cusps[(i + 1) % cusps.length];
    const start = current.longitude;
    const end = next.longitude;
    if (start < end) {
      if (lon >= start && lon < end) return current.house;
    } else {
      // Crossover case
      if (lon >= start || lon < end) return current.house;
    }
  }
  return 1;
}

/**
 * Advanced Relationship Scoring
 */
export function calculateRelationshipScore(
  bodiesA: CelestialPosition[],
  bodiesB: CelestialPosition[],
  ascendantA?: number, 
  ascendantB?: number
): RelationshipScore {
  let scoreValue = 0;
  const breakdown: ScoreBreakdownItem[] = [];
  
  const sunA = bodiesA.find(b => b.id === BodyId.Sun);
  const sunB = bodiesB.find(b => b.id === BodyId.Sun);

  let isDestinySign = false;
  if (sunA && sunB) {
    const qA = QUALITY_MAP[sunA.sign];
    const qB = QUALITY_MAP[sunB.sign];
    if (qA && qB && qA === qB) {
        isDestinySign = true;
        scoreValue += DESTINY_SIGN_POINTS;
        breakdown.push({
            rule: 'destiny_sign',
            description: `Both Suns are ${qA}`,
            points: DESTINY_SIGN_POINTS,
            details: `${sunA.sign} - ${sunB.sign}`
        });
    }
  }

  const aspects = calculateDualAspects(bodiesA, bodiesB);

  const addPoints = (pts: number, rule: string, desc: string, asp: Aspect) => {
    scoreValue += pts;
    breakdown.push({
        rule,
        description: desc,
        points: pts,
        details: `${asp.body1.name}-${asp.body2.name} ${asp.type} (${asp.orb.toFixed(1)}°)`
    });
  };

  for (const asp of aspects) {
    if (asp.body1.id === BodyId.Sun && asp.body2.id === BodyId.Sun) {
      if ([AspectType.Conjunction, AspectType.Opposition, AspectType.Square].includes(asp.type)) {
          const isHigh = asp.orb <= HIGH_PRECISION_ORBIT_THRESHOLD;
          addPoints(isHigh ? MAJOR_ASPECT_POINTS_HIGH : MAJOR_ASPECT_POINTS_STD, 'sun_sun_major', `Sun-Sun ${asp.type}`, asp);
      } else {
          addPoints(MINOR_ASPECT_POINTS, 'sun_sun_minor', `Sun-Sun ${asp.type}`, asp);
      }
    }

    const hasSun = asp.body1.id === BodyId.Sun || asp.body2.id === BodyId.Sun;
    const hasMoon = asp.body1.id === BodyId.Moon || asp.body2.id === BodyId.Moon;

    if (hasSun && hasMoon) {
        if (asp.type === AspectType.Conjunction) {
            const isHigh = asp.orb <= HIGH_PRECISION_ORBIT_THRESHOLD;
            addPoints(isHigh ? MAJOR_ASPECT_POINTS_HIGH : MAJOR_ASPECT_POINTS_STD, 'sun_moon_conj', `Sun-Moon Conjunction`, asp);
        } else {
            addPoints(MINOR_ASPECT_POINTS, 'sun_moon_other', `Sun-Moon ${asp.type}`, asp);
        }
    }

    const hasVenus = asp.body1.id === BodyId.Venus || asp.body2.id === BodyId.Venus;
    const hasMars = asp.body1.id === BodyId.Mars || asp.body2.id === BodyId.Mars;

    if (hasVenus && hasMars) {
        addPoints(VENUS_MARS_POINTS, 'venus_mars', `Venus-Mars ${asp.type}`, asp);
    }
  }

  let description = "Minimal";
  for (const t of SCORE_THRESHOLDS) {
      if (scoreValue < t.threshold) {
          description = t.label;
          break;
      }
  }

  return {
      score: scoreValue,
      description,
      isDestinySign,
      aspects,
      breakdown
  };
}
