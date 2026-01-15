import { calculateChart } from './calculator.js';
import { renderChart } from './visuals/natal-renderer.js';
import { renderTransitChart } from './visuals/transit-renderer.js';
import { renderSynastryChart } from './visuals/synastry-renderer.js';
import { GeoLocation, BodyId } from './core/types.js';

export interface ChartDataInput {
  date: string | Date;
  location: GeoLocation;
  includeBodies?: BodyId[];
}

/**
 * Creates a standard Natal Chart SVG.
 */
export function natalChart(input: ChartDataInput): string {
  const chart = calculateChart({ ...input, aspectBodies: input.includeBodies });
  // Currently renderers use hardcoded ChartDefinitions. 
  // We should update the natal-renderer.ts to pass includeBodies to the planetRing component.
  return renderChart(chart);
}

/**
 * Creates a Transit Chart SVG.
 */
export function transitChart(natalInput: ChartDataInput, transitInput?: ChartDataInput): string {
  const natal = calculateChart({ ...natalInput, aspectBodies: natalInput.includeBodies });
  
  const tInput = transitInput || { 
    date: new Date(), 
    location: natalInput.location,
    includeBodies: natalInput.includeBodies
  };
  const transit = calculateChart({ ...tInput, aspectBodies: tInput.includeBodies });
  
  return renderTransitChart(natal, transit);
}

/**
 * Creates a Synastry Chart SVG.
 */
export function synastryChart(personA: ChartDataInput, personB: ChartDataInput): string {
  const chartA = calculateChart({ ...personA, aspectBodies: personA.includeBodies });
  const chartB = calculateChart({ ...personB, aspectBodies: personB.includeBodies });
  
  return renderSynastryChart(chartA, chartB);
}