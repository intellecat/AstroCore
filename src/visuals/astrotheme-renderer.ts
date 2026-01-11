import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
import './core/adapters.js';

export function renderAstrothemeChart(chart: ChartData): string {
  const width = 600;
  const height = 600;
  const mainRadius = Math.min(width, height) * 0.45;

  // Layout Configuration
  const planetBandWidth = mainRadius * 0.25;
  const houseBandWidth = mainRadius * 0.08;
  const zodiacBandWidth = mainRadius * 0.3;

  // Boundaries (Outside -> Inside)
  const planetOuter = mainRadius;
  const planetInner = planetOuter - planetBandWidth;

  const houseOuter = planetInner;
  const houseInner = houseOuter - houseBandWidth;

  const zodiacOuter = houseInner;
  const zodiacInner = zodiacOuter - zodiacBandWidth;

  const aspectRadius = zodiacInner;

  const definition: ChartDefinition = {
    width,
    height,
    components: [
      { type: 'circle', props: { radius: mainRadius, fill: 'var(--astro-color-paper)' } },
      
      // 1. Aspects Area
      { type: 'circle', props: { radius: aspectRadius, stroke: 'var(--astro-color-text)', strokeOpacity: 0.1 } },

      // 2. Zodiac Ring
      { type: 'zodiacWheel', props: { 
          outerRadius: zodiacOuter, 
          innerRadius: zodiacInner, 
          symbolRadius: zodiacInner + (zodiacBandWidth / 2),
          showSignBackgrounds: true
      } },
      
      { type: 'degreeRings', props: { 
          degreeRadius: zodiacOuter,
          tickSmall: 3,
          tickMedium: 5,
          tickLarge: 8
      } },

      // 3. Houses Ring
      { type: 'circle', props: { radius: houseInner, stroke: 'var(--astro-color-text)', strokeOpacity: 0.2 } },
      { type: 'circle', props: { radius: houseOuter, stroke: 'var(--astro-color-text)', strokeOpacity: 0.2 } },
      
      { type: 'houseLines', props: { 
          radius: zodiacOuter, 
          endRadius: houseOuter, 
          showLabels: true,
          labelRadius: houseInner + (houseBandWidth / 2),
          angleLabelRadius: houseOuter + 12
      } },

      // 4. Planets Ring
      { 
        type: 'planetRing', 
        props: { 
          symbolRadius: planetInner + (planetBandWidth * 0.5),
          tickStartRadius: houseOuter,
          tickLength: 20, 
          degreeRadius: planetOuter - 10,
          avoidHouses: false
        } 
      },
      
      { type: 'aspectLines', props: { radius: aspectRadius } }
    ]
  };

  return createChart(definition, chart);
}
