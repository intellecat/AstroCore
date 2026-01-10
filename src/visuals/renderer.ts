import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
import { computeLayout } from './layout.js';
import './core/adapters.js';
import { Theme } from './theme.js';
import { MarkerRenderer } from './components/Markers.js';

export interface RenderOptions {
  width?: number;
  height?: number;
  theme?: Theme;
  showAspects?: boolean;
  markerRenderer?: MarkerRenderer;
}

export function renderChart(chart: ChartData, options: RenderOptions = {}): string {
  const radius = Math.min(options.width ?? 600, options.height ?? 600) * 0.45;
  const layout = computeLayout(radius);

  const definition: ChartDefinition = {
    width: options.width,
    height: options.height,
    theme: options.theme,
    components: [
      { type: 'circle', props: { radius: layout.radius, fill: 'var(--astro-color-paper)' } },
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
      } }
    ]
  };

  if (options.showAspects !== false) {
    definition.components.push({ type: 'aspectLines', props: { radius: layout.aspectBoundary } });
  }

  return createChart(definition, chart);
}
