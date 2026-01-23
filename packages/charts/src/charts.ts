import { calculateChart } from '@astrologer/astro-core';
import { renderChart } from './visuals/natal-renderer.js';
import { renderNoonChart } from './visuals/noon-renderer.js';
import { renderTransitChart } from './visuals/transit-renderer.js';
import { renderSynastryChart } from './visuals/synastry-renderer.js';
import { GeoLocation, BodyId } from '@astrologer/astro-core';

export interface ChartDataInput {
  date: string | Date;
  location: GeoLocation;
  bodies?: BodyId[];
}

/**
 * Creates a standard Natal Chart SVG.
 */
export function natalChart(input: ChartDataInput): string {
  const chart = calculateChart(input);
  return renderChart(chart);
}

/**
 * Creates a Noon Chart SVG (Unknown birth time).
 */
export function noonChart(input: ChartDataInput): string {
  const chart = calculateChart(input);
  return renderNoonChart(chart);
}

/**
 * Creates a Transit Chart SVG.
 */
export function transitChart(natalInput: ChartDataInput, transitInput?: ChartDataInput): string {
  const natal = calculateChart(natalInput);
  
  const tInput = transitInput || { 
    date: new Date(), 
    location: natalInput.location,
    bodies: natalInput.bodies
  };
  const transit = calculateChart(tInput);
  
  return renderTransitChart(natal, transit);
}

/**
 * Creates a Synastry Chart SVG.
 */
export function synastryChart(personA: ChartDataInput, personB: ChartDataInput): string {
  const chartA = calculateChart(personA);
  const chartB = calculateChart(personB);
  
  return renderSynastryChart(chartA, chartB);
}
