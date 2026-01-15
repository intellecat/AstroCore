import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
import './core/adapters.js';

export function renderChart(chart: ChartData): string {
  const width = 600;
  const height = 600;
  const mainRadius = Math.min(width, height) * 0.45;

  const definition: ChartDefinition = {
    width,
    height,
    components: [
      { type: 'circle', props: { radius: mainRadius, fill: 'var(--astro-color-paper)' } },
      { type: 'zodiacWheel', props: { 
          outerRadius: mainRadius, 
          innerRadius: mainRadius - 45, 
          symbolRadius: mainRadius - 22 
      } },
      { type: 'degreeRings', props: { 
          degreeRadius: mainRadius - 45,
          tickSmall: 3,
          tickMedium: 6,
          tickLarge: 10
      } },
      { type: 'houseLines', props: { 
          radius: mainRadius * 0.5,
          angleLabelRadius: mainRadius * 0.45
      } },
      { type: 'circle', props: { radius: mainRadius * 0.4, stroke: 'var(--astro-color-text)', strokeOpacity: 0.1 } },
      { type: 'planetRing', props: { 
          symbolRadius: mainRadius - 75,
          degreeRadius: mainRadius - 95,
          tickStartRadius: mainRadius - 45,
          tickLength: 10
      } },
      { type: 'aspectLines', props: { radius: mainRadius * 0.4, showAspectSymbol: true } }
    ]
  };

  return createChart(definition, chart);
}
