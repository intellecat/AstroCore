import { polarToCartesian } from '../geometry.js';
import { HouseCusp } from '../../core/types.js';

export function drawHouseLines(
  cx: number,
  cy: number,
  radius: number,
  houses: HouseCusp[],
  rotationOffset: number
): string {
  let svg = '<g id="house-lines">';

  // Draw the house ring circle
  svg += `<circle cx="${cx}" cy="${cy}" r="${radius * 0.5}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.1" />`;

  houses.forEach((house, i) => {
    const nextHouse = houses[(i + 1) % houses.length];
    
    // Draw Cusp Line
    const innerPoint = polarToCartesian(cx, cy, radius * 0.4, house.longitude, rotationOffset);
    const outerPoint = polarToCartesian(cx, cy, radius - 40, house.longitude, rotationOffset);
    
    const isAngle = [1, 4, 7, 10].includes(house.house);
    const strokeWidth = isAngle ? 1.5 : 0.8;
    const opacity = isAngle ? 0.5 : 0.2;

    svg += `<line x1="${innerPoint.x}" y1="${innerPoint.y}" 
                  x2="${outerPoint.x}" y2="${outerPoint.y}" 
                  stroke="var(--astro-color-text)" 
                  stroke-width="${strokeWidth}" 
                  stroke-opacity="${opacity}" 
                  stroke-dasharray="${isAngle ? '' : '3,3'}" />`;

    // Draw House Number
    let midLong = (house.longitude + nextHouse.longitude) / 2;
    if (nextHouse.longitude < house.longitude) midLong += 180;
    
    const textPos = polarToCartesian(cx, cy, radius * 0.45, midLong, rotationOffset);
    
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