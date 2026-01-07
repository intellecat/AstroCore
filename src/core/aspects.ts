import { CelestialPosition, Aspect, AspectType } from './types.js';

export interface AspectDefinition {
  type: AspectType;
  angle: number;
  orb: number;
}

const DEFAULT_ASPECTS: AspectDefinition[] = [
  { type: AspectType.Conjunction, angle: 0, orb: 8 },
  { type: AspectType.Opposition, angle: 180, orb: 8 },
  { type: AspectType.Trine, angle: 120, orb: 8 },
  { type: AspectType.Square, angle: 90, orb: 8 },
  { type: AspectType.Sextile, angle: 60, orb: 6 }
];

function getAngularDistance(l1: number, l2: number): number {
  let diff = Math.abs(l1 - l2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function isAspectApplying(
  angleNow: number, 
  targetAngle: number, 
  b1: CelestialPosition, 
  b2: CelestialPosition
): boolean {
  const gap = Math.abs(angleNow - targetAngle);

  const p1_next = (b1.longitude + b1.speed) % 360;
  const p2_next = (b2.longitude + b2.speed) % 360;
  
  const angleNext = getAngularDistance(p1_next, p2_next);
  const gapNext = Math.abs(angleNext - targetAngle);

  return gapNext < gap;
}

export function calculateAspects(
  bodies: CelestialPosition[],
  customAspects: AspectDefinition[] = DEFAULT_ASPECTS
): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const b1 = bodies[i];
      const b2 = bodies[j];
      const angle = getAngularDistance(b1.longitude, b2.longitude);

      for (const def of customAspects) {
        const orb = Math.abs(angle - def.angle);
        if (orb <= def.orb) {
            aspects.push({
                body1: b1,
                body2: b2,
                type: def.type,
                angle,
                orb,
                isApplying: isAspectApplying(angle, def.angle, b1, b2)
            });
        }
      }
    }
  }
  return aspects;
}

export function calculateDualAspects(
  bodiesA: CelestialPosition[],
  bodiesB: CelestialPosition[],
  customAspects: AspectDefinition[] = DEFAULT_ASPECTS
): Aspect[] {
  const aspects: Aspect[] = [];

  for (const b1 of bodiesA) {
    for (const b2 of bodiesB) {
       const angle = getAngularDistance(b1.longitude, b2.longitude);

       for (const def of customAspects) {
        const orb = Math.abs(angle - def.angle);
        if (orb <= def.orb) {
            aspects.push({
                body1: b1,
                body2: b2,
                type: def.type,
                angle,
                orb,
                isApplying: isAspectApplying(angle, def.angle, b1, b2)
            });
        }
      }
    }
  }
  return aspects;
}
