import { polarToCartesian } from '../geometry.js';
import { HouseCusp } from '../../core/types.js';
import { ChartLayout } from '../layout.js';

export function drawHouseLines(
  cx: number,
  cy: number,
  houses: HouseCusp[],
  rotationOffset: number,
  layout: ChartLayout
): string {
  let svg = '<g id="house-lines">';

  // House Ring circle
  svg += `<circle cx="${cx}" cy="${cy}" r="${layout.houseRing}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.1" />`;

  houses.forEach((house, i) => {
    const nextHouse = houses[(i + 1) % houses.length];
    
    // Line from inner ring to zodiac inner edge
    const innerPoint = polarToCartesian(cx, cy, layout.houseRing, house.longitude, rotationOffset);
    const outerPoint = polarToCartesian(cx, cy, layout.zodiacInner, house.longitude, rotationOffset);
    
    const isAngle = [1, 4, 7, 10].includes(house.house);
    const strokeWidth = isAngle ? 1.5 : 0.8;
    const opacity = isAngle ? 0.5 : 0.2;

    svg += `<line x1="${innerPoint.x}" y1="${innerPoint.y}" 
                  x2="${outerPoint.x}" y2="${outerPoint.y}" 
                  stroke="var(--astro-color-text)" 
                  stroke-width="${strokeWidth}" 
                  stroke-opacity="${opacity}" 
                  stroke-dasharray="${isAngle ? '' : '3,3'}" />`;

    let midLong = (house.longitude + nextHouse.longitude) / 2;
    if (nextHouse.longitude < house.longitude) midLong += 180;
    
    const textPos = polarToCartesian(cx, cy, layout.houseText, midLong, rotationOffset);
    
    svg += `<text x="${textPos.x}" y="${textPos.y}" 
                  fill="var(--astro-color-text)" 
                  font-size="9" 
                  text-anchor="middle" 
                  dominant-baseline="middle" 
                  opacity="0.4">${house.house}</text>`;
  });

  svg += '</g>';
  return svg;
}
