import { ChartData } from '@astrologer/astro-core';
import { createChart, ChartDefinition } from './core/engine.js';
import './core/adapters.js';

export function renderTransitChart(natalChart: ChartData, transitChart: ChartData): string {
  const width = 600;
  const height = 600;
  const mainRadius = Math.min(width, height) * 0.45;
  
  // Layout Calculation
  const transitBand = mainRadius * 0.15;
  const innerRadius = mainRadius - transitBand;

  const definition: ChartDefinition = {
    width,
    height,
    components: [
      // { type: 'circle', props: { radius: mainRadius, fill: 'var(--astro-color-paper)', stroke: 'none' } },
      
      // Transit Ring Boundary
      { type: 'circle', props: { radius: innerRadius, stroke: 'var(--astro-color-text)', strokeOpacity: 0.2 } },

      // Inner Natal Chart
      { type: 'zodiacWheel', props: { 
          outerRadius: innerRadius, 
          innerRadius: innerRadius - 35, 
          symbolRadius: innerRadius - 17 
      } },
      { type: 'degreeRings', props: { 
          degreeRadius: innerRadius - 35,
          tickSmall: 3,
          tickMedium: 5,
          tickLarge: 8
      } },
      { type: 'houseLines', props: { 
          radius: innerRadius * 0.55,
          angleLabelRadius: innerRadius * 0.52
      } },
      
      { type: 'circle', props: { radius: innerRadius * 0.45, stroke: 'var(--astro-color-text)', strokeOpacity: 0.1 } },
      
      { type: 'planetRing', props: { 
          symbolRadius: innerRadius - 60,
          degreeRadius: innerRadius - 75,
          tickStartRadius: innerRadius - 35,
          tickLength: 8,
          includeBodies: natalChart.meta.bodies
      } },

      // Outer Transit Ring
      { 
        type: 'planetRing', 
        dataSource: 'secondary',
        props: {
            symbolRadius: mainRadius - 25,
            tickStartRadius: innerRadius,
            tickLength: 8,
            degreeRadius: mainRadius - 6,
            avoidHouses: false,
            includeBodies: transitChart.meta.bodies
        }
      },
      
      { 
        type: 'aspectLines', 
        dataSource: 'combined',
        props: { radius: innerRadius * 0.45 } 
      }
    ]
  };

  return createChart(definition, natalChart, transitChart);
}
