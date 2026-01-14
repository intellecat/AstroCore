import { calculateChart } from './calculator.js';
import { renderChart } from './visuals/renderer.js';
import { renderTransitChart } from './visuals/transit-renderer.js';
import { renderSynastryChart } from './visuals/synastry-renderer.js';
import { GeoLocation } from './core/types.js';

export interface ChartDataInput {
  date: string | Date;
  location: GeoLocation;
}

/**
 * Creates a standard Natal Chart SVG.
 */
export function natalChart(input: ChartDataInput): string {
  const chart = calculateChart(input);
  return renderChart(chart);
}

/**
 * Creates a Transit Chart SVG.
 * @param natalInput The birth data.
 * @param transitInput The transit date/location. Defaults to NOW at birth location if omitted.
 */
export function transitChart(natalInput: ChartDataInput, transitInput?: ChartDataInput): string {
  const natal = calculateChart(natalInput);
  
  const tInput = transitInput || { 
    date: new Date(), 
    location: natalInput.location 
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