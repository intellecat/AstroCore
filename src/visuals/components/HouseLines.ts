import { polarToCartesian } from '../geometry.js';
import { HouseCusp } from '../../core/types.js';
import { ChartLayout } from '../layout.js';

export function drawHouseLines(
  cx: number,
  cy: number,
  houses: HouseCusp[],
  rotationOffset: number,
  layout: ChartLayout,
  options?: {
      startRadius?: number;
      endRadius?: number;
      showLabels?: boolean;
      labelRadius?: number;
  }
): string {
  let svg = '<g class="house-lines">';

  const startR = options?.startRadius ?? layout.houseRing;
  const endR = options?.endRadius ?? layout.zodiacInner;
  const showLabels = options?.showLabels ?? true;

  // House Ring circle
  svg += `<circle cx="${cx}" cy="${cy}" r="${startR}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.1" />`;

  houses.forEach((house, i) => {
    const nextHouse = houses[(i + 1) % houses.length];
    
    // Line from inner ring to outer ring
    const innerPoint = polarToCartesian(cx, cy, startR, house.longitude, rotationOffset);
    const outerPoint = polarToCartesian(cx, cy, endR, house.longitude, rotationOffset);
    
    const isAngle = [1, 4, 7, 10].includes(house.house);
    const strokeWidth = isAngle ? 1.5 : 0.8;
    const opacity = isAngle ? 0.5 : 0.2;

    svg += `<line x1="${innerPoint.x}" y1="${innerPoint.y}" 
                  x2="${outerPoint.x}" y2="${outerPoint.y}" 
                  stroke="var(--astro-color-text)" 
                  stroke-width="${strokeWidth}" 
                  stroke-opacity="${opacity}" 
                  stroke-dasharray="${isAngle ? '' : '3,3'}" />`;

    if (showLabels) {
        // ANGLE LABELS (ASC, MC, etc)
        if (isAngle) {
            let label = '';
            switch(house.house) {
                case 1: label = 'ASC'; break;
                case 4: label = 'IC'; break;
                case 7: label = 'DSC'; break;
                case 10: label = 'MC'; break;
            }
            
            // For custom bands, we might want to skip angle labels or position them differently
            // Only draw angle labels if we are using the default inner house ring
            if (!options?.startRadius) {
                const labelPos = polarToCartesian(cx, cy, layout.angleLabelRadius, house.longitude, rotationOffset);
                svg += `<text x="${labelPos.x}" y="${labelPos.y}" 
                              fill="var(--astro-color-text)" 
                              font-size="7" font-weight="bold"
                              text-anchor="middle" dominant-baseline="middle" 
                              opacity="0.6">${label}</text>`;
                
                const degPos = polarToCartesian(cx, cy, layout.angleLabelRadius - 10, house.longitude, rotationOffset);
                svg += `<text x="${degPos.x}" y="${degPos.y}" 
                              fill="var(--astro-color-text)" 
                              font-size="6"
                              text-anchor="middle" dominant-baseline="middle" 
                              opacity="0.4">${Math.floor(house.degree)}°</text>`;
            }
        }

        // House Number
        let midLong = (house.longitude + nextHouse.longitude) / 2;
        if (nextHouse.longitude < house.longitude) midLong += 180;
        
        // Use provided labelRadius or fallback to layout.houseText
        const textR = options?.labelRadius ?? layout.houseText;

        const textPos = polarToCartesian(cx, cy, textR, midLong, rotationOffset);
        
        svg += `<text x="${textPos.x}" y="${textPos.y}" 
                      fill="var(--astro-color-text)" 
                      font-size="8" 
                      text-anchor="middle" 
                      dominant-baseline="middle" 
                      opacity="0.4">${house.house}</text>`;
    }
  });

  svg += '</g>';
  return svg;
}
