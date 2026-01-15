import { LunarPhase } from './types.js';

const PHASES = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent'
];

/**
 * Calculates the lunar phase details.
 */
export function calculateLunarPhase(sunLong: number, moonLong: number): LunarPhase {
  const age = (moonLong - sunLong + 360) % 360;

  const phaseIndex = Math.floor(((age + 22.5) % 360) / 45);
  const phaseName = PHASES[phaseIndex];

  const rads = age * (Math.PI / 180);
  const illumination = (1 - Math.cos(rads)) / 2;

  return {
    phaseName,
    illumination,
    age,
    isWaxing: age < 180
  };
}
