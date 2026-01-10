import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
import { computeTransitLayout } from './transit-layout.js';
import './core/adapters.js';
import { RenderOptions } from './renderer.js';

export function renderTransitChart(natalChart: ChartData, transitChart: ChartData, options: RenderOptions = {}): string {
  const radius = Math.min(options.width ?? 600, options.height ?? 600) * 0.45;
  const layout = computeTransitLayout(radius);

  const definition: ChartDefinition = {
    width: options.width,
    height: options.height,
    theme: options.theme,
    components: [
      { type: 'circle', props: { radius: layout.radius, fill: 'var(--astro-color-paper)' } },
      
      // Transit Ring Boundary
      { type: 'circle', props: { radius: layout.transitRingInner, stroke: 'var(--astro-color-text)', strokeOpacity: 0.2 } },

      // Inner Natal Chart
      { type: 'zodiacWheel', props: { 
          outerRadius: layout.zodiacOuter, 
          innerRadius: layout.zodiacInner, 
          symbolRadius: layout.zodiacSymbol 
      } },
      { type: 'degreeRings', props: { 
          degreeRadius: layout.degreeRing,
          tickSmall: layout.degreeTickSmall,
          tickMedium: layout.degreeTickMedium,
          tickLarge: layout.degreeTickLarge
      } },
      { type: 'houseLines', props: { radius: layout.houseRing } },
      
      { type: 'circle', props: { radius: layout.aspectBoundary, stroke: 'var(--astro-color-text)', strokeOpacity: 0.1 } },
      
      { type: 'planetRing', props: { 
          symbolRadius: layout.planetSymbol,
          degreeRadius: layout.planetDegree,
          tickStartRadius: layout.planetTickStart,
          tickLength: layout.planetTickLength,
          markerRenderer: options.markerRenderer
      } },

      // Outer Transit Ring
      { 
        type: 'outerPlanetRing', 
        dataSource: 'secondary',
        props: {
            symbolRadius: layout.transitSymbol,
            tickStartRadius: layout.transitTickStart,
            tickLength: layout.transitTickLength,
            degreeRadius: layout.transitDegree
        }
      }
    ]
  };

  if (options.showAspects !== false) {
    definition.components.push({ 
        type: 'aspectLines', 
        dataSource: 'combined',
        props: { radius: layout.aspectBoundary } 
    });
  }

  return createChart(definition, natalChart, transitChart);
}
