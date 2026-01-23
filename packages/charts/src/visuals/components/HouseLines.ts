import { polarToCartesian } from '../geometry.js';
import { HouseCusp } from '@astrologer/astro-core';

export interface HouseLinesConfig {
    radius: number;
    endRadius: number;
    showLabels?: boolean;
    labelRadius?: number;
    angleLabelRadius?: number;
    degreeLabelRadius?: number;
}

export function drawHouseLines(
  cx: number,
  cy: number,
  houses: HouseCusp[],
  rotationOffset: number,
  config: HouseLinesConfig
): string {
  let svg = '<g class="house-lines">';

  const startRadius = config.radius;
  const endRadius = config.endRadius;
  const showLabels = config.showLabels ?? true;

  // House Ring circle
  svg += `<circle cx="${cx}" cy="${cy}" r="${startRadius}" class="astro-house-ring" />`;

  houses.forEach((house, i) => {
    const nextHouse = houses[(i + 1) % houses.length];
    
    // Line from inner ring to outer ring
    const innerPoint = polarToCartesian(cx, cy, startRadius, house.longitude, rotationOffset);
    const outerPoint = polarToCartesian(cx, cy, endRadius, house.longitude, rotationOffset);
    
    const isAngle = [1, 4, 7, 10].includes(house.house);
    const lineClass = isAngle ? 'astro-house-line angle' : 'astro-house-line';

    svg += `<line x1="${innerPoint.x}" y1="${innerPoint.y}" 
                  x2="${outerPoint.x}" y2="${outerPoint.y}" 
                  class="${lineClass}" />`;

    if (showLabels) {
        // ANGLE LABELS (ASC, MC, etc)
        if (isAngle && config.angleLabelRadius) {
            let label = '';
            switch(house.house) {
                case 1: label = 'ASC'; break;
                case 4: label = 'IC'; break;
                case 7: label = 'DSC'; break;
                case 10: label = 'MC'; break;
            }
            
            const labelPos = polarToCartesian(cx, cy, config.angleLabelRadius, house.longitude, rotationOffset);
            svg += `<text x="${labelPos.x}" y="${labelPos.y}" class="astro-angle-label">${label}</text>`;
            
            const degR = config.degreeLabelRadius ?? (config.angleLabelRadius - 15);
            const degPos = polarToCartesian(cx, cy, degR, house.longitude, rotationOffset);
            svg += `<text x="${degPos.x}" y="${degPos.y}" class="astro-angle-degree">${Math.floor(house.degree)}°</text>`;
        }

        // House Number
        let midLong = (house.longitude + nextHouse.longitude) / 2;
        if (nextHouse.longitude < house.longitude) midLong += 180;
        
        const textRadius = config.labelRadius ?? (startRadius - 15);

        const textPos = polarToCartesian(cx, cy, textRadius, midLong, rotationOffset);
        
        svg += `<text x="${textPos.x}" y="${textPos.y}" class="astro-house-label">${house.house}</text>`;
    }
  });

  svg += '</g>';
  return svg;
}