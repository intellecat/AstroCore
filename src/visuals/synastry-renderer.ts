import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
import { computeSynastryLayout } from './synastry-layout.js';
import './core/adapters.js';
import { RenderOptions } from './renderer.js';

export function renderSynastryChart(chartA: ChartData, chartB: ChartData, options: RenderOptions = {}): string {
  const radius = Math.min(options.width ?? 700, options.height ?? 700) * 0.45;
  const layout = computeSynastryLayout(radius);

  const definition: ChartDefinition = {
    width: 700,
    height: 700,
    theme: options.theme,
    components: [
      { type: 'circle', props: { radius: layout.radius, fill: 'var(--astro-color-paper)' } },
      
      // Zodiac & Scales
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

      // 3. Person B (Outer Ring)
      { 
        type: 'houseLines', 
        dataSource: 'secondary',
        props: { 
            startRadius: layout.outerRing.innerRadius, 
            endRadius: layout.outerRing.baseRadius,
            showLabels: true,
            labelRadius: layout.outerRing.innerRadius + 8
        }
      },
      {
        type: 'stackedPlanetRing',
        dataSource: 'secondary',
        props: {
            symbolRadius: layout.outerRing.symbolRadius,
            orbitStep: layout.outerRing.orbitStep,
            tickStartRadius: layout.outerRing.tickStart,
            tickLength: layout.outerRing.tickLength
        }
      },

      // 5. Person A (Inner Ring)
      { 
        type: 'houseLines', 
        dataSource: 'primary',
        props: { 
            startRadius: layout.innerRing.innerRadius, 
            endRadius: layout.innerRing.baseRadius,
            showLabels: true,
            labelRadius: layout.innerRing.innerRadius + 8
        }
      },
      {
        type: 'stackedPlanetRing',
        dataSource: 'primary',
        props: {
            symbolRadius: layout.innerRing.symbolRadius,
            orbitStep: layout.innerRing.orbitStep,
            tickStartRadius: layout.innerRing.tickStart,
            tickLength: layout.innerRing.tickLength
        }
      },

      // 6. Aspects
      { type: 'circle', props: { radius: layout.aspectBoundary, stroke: 'var(--astro-color-text)', strokeOpacity: 0.1 } },
    ]
  };

  if (options.showAspects !== false) {
    definition.components.push({ 
        type: 'aspectLines', 
        dataSource: 'combined',
        props: { radius: layout.aspectBoundary } 
    });
  }

  return createChart(definition, chartA, chartB);
}
