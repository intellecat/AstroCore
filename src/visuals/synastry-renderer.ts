import { ChartData } from '../core/types.js';
import { createChart, ChartDefinition } from './core/engine.js';
import './core/adapters.js';

export function renderSynastryChart(chartA: ChartData, chartB: ChartData): string {
  const width = 700;
  const height = 700;
  const mainRadius = Math.min(width, height) * 0.45;
  
  const zodiacInnerRadius = mainRadius - 40; 
  const bandThickness = 65; 

  // Person B Band (Outer)
  const personBOuterRadius = zodiacInnerRadius;
  const personBInnerRadius = personBOuterRadius - bandThickness;
  
  // Person A Band (Inner)
  const personAOuterRadius = personBInnerRadius;
  const personAInnerRadius = personAOuterRadius - bandThickness;

  const innerHouseRingRadius = personAInnerRadius;
  const aspectBoundary = innerHouseRingRadius;

  const definition: ChartDefinition = {
    width,
    height,
    components: [
      { type: 'circle', props: { radius: mainRadius, fill: 'var(--astro-color-paper)' } },
      
      // Zodiac & Scales
      { type: 'zodiacWheel', props: { 
          outerRadius: mainRadius, 
          innerRadius: zodiacInnerRadius, 
          symbolRadius: mainRadius - 20 
      } },
      { type: 'degreeRings', props: { 
          degreeRadius: zodiacInnerRadius,
          tickSmall: 3,
          tickMedium: 5,
          tickLarge: 8
      } },

      // 3. Person B (Outer Ring)
      { 
        type: 'houseLines', 
        dataSource: 'secondary',
        props: { 
            startRadius: personBInnerRadius, 
            endRadius: personBOuterRadius,
            showLabels: true,
            labelRadius: personBInnerRadius + 8,
            angleLabelRadius: personBOuterRadius - 25
        }
      },
      {
        type: 'stackedPlanetRing',
        dataSource: 'secondary',
        props: {
            symbolRadius: personBOuterRadius - 25,
            orbitStep: 18,
            tickStartRadius: zodiacInnerRadius,
            tickLength: 10
        }
      },

      // 5. Person A (Inner Ring)
      { 
        type: 'houseLines', 
        dataSource: 'primary',
        props: { 
            startRadius: personAInnerRadius, 
            endRadius: personAOuterRadius,
            showLabels: true,
            labelRadius: personAInnerRadius + 8,
            angleLabelRadius: personAInnerRadius + 35
        }
      },
      {
        type: 'stackedPlanetRing',
        dataSource: 'primary',
        props: {
            symbolRadius: personAOuterRadius - 25,
            orbitStep: 18,
            tickStartRadius: personAOuterRadius,
            tickLength: 10
        }
      },

      // 6. Aspects
      { type: 'circle', props: { radius: aspectBoundary, stroke: 'var(--astro-color-text)', strokeOpacity: 0.1 } },
      
      { 
        type: 'aspectLines', 
        dataSource: 'combined',
        props: { radius: aspectBoundary } 
      }
    ]
  };

  return createChart(definition, chartA, chartB);
}