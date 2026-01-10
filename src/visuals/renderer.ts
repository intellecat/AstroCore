import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
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
  const mainRadius = Math.min(options.width ?? 600, options.height ?? 600) * 0.45;

  const definition: ChartDefinition = {
    width: options.width,
    height: options.height,
    theme: options.theme,
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
          tickLength: 10,
          markerRenderer: options.markerRenderer
      } }
    ]
  };

  if (options.showAspects !== false) {
    definition.components.push({ type: 'aspectLines', props: { radius: mainRadius * 0.4 } });
  }

  return createChart(definition, chart);
}