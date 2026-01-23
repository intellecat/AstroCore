import { ChartData } from '@astrologer/astro-core';
import { createChart, ChartDefinition } from './core/engine.js';
import './core/adapters.js';

export function renderNoonChart(chart: ChartData): string {
  const width = 600;
  const height = 600;
  const mainRadius = Math.min(width, height) * 0.45;

  const definition: ChartDefinition = {
    width,
    height,
    rotationOffset: 180, // Fix 0 Aries to Left (9 o'clock)
    components: [
      { type: 'circle', props: { radius: mainRadius, fill: 'var(--astro-color-paper)' } },
      { type: 'zodiacWheel', props: { 
          outerRadius: mainRadius, 
          innerRadius: mainRadius - 45, 
          symbolRadius: mainRadius - 22 
      } },
      { type: 'circle', props: { radius: mainRadius * 0.5, stroke: 'var(--astro-color-text)', strokeOpacity: 0.1 } },
      { type: 'planetRing', props: { 
          symbolRadius: mainRadius - 75,
          degreeRadius: mainRadius - 95,
          tickStartRadius: mainRadius - 45,
          tickLength: 10,
          avoidHouses: false, // Noon chart has no houses
          includeBodies: chart.meta.bodies
      } },
      { type: 'aspectLines', props: { radius: mainRadius * 0.5 } }
    ]
  };

  return createChart(definition, chart);
}
