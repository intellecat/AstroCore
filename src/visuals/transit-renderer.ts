import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
import './core/adapters.js';
import { RenderOptions } from './renderer.js';

export function renderTransitChart(natalChart: ChartData, transitChart: ChartData, options: RenderOptions = {}): string {
  const mainRadius = Math.min(options.width ?? 600, options.height ?? 600) * 0.45;
  
  // Layout Calculation
  const transitBand = mainRadius * 0.15;
  const innerRadius = mainRadius - transitBand;

  const definition: ChartDefinition = {
    width: options.width,
    height: options.height,
    theme: options.theme,
    components: [
      { type: 'circle', props: { radius: mainRadius, fill: 'var(--astro-color-paper)' } },
      
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
          markerRenderer: options.markerRenderer
      } },

      // Outer Transit Ring
      { 
        type: 'outerPlanetRing', 
        dataSource: 'secondary',
        props: {
            symbolRadius: mainRadius - 20,
            tickStartRadius: innerRadius,
            tickLength: 10,
            degreeRadius: mainRadius - 8
        }
      }
    ]
  };

  if (options.showAspects !== false) {
    definition.components.push({ 
        type: 'aspectLines', 
        dataSource: 'combined',
        props: { radius: innerRadius * 0.45 } 
    });
  }

  return createChart(definition, natalChart, transitChart);
}