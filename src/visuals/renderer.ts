import { ChartData } from '../core/types.js';
import { getAscendantOffset } from './geometry.js';
import { DEFAULT_THEME, Theme, generateCssVariables } from './theme.js';
import { SVG_SYMBOLS } from './symbols.js';
import { drawZodiacWheel } from './components/ZodiacWheel.js';
import { drawHouseLines } from './components/HouseLines.js';
import { drawPlanetGlyphs } from './components/PlanetGlyphs.js';
import { drawAspectLines } from './components/AspectLines.js';

export interface RenderOptions {
  width?: number;
  height?: number;
  theme?: Theme;
  showAspects?: boolean;
}

export function renderChart(chart: ChartData, options: RenderOptions = {}): string {
  const width = options.width ?? 600;
  const height = options.height ?? 600;
  const theme = options.theme ?? DEFAULT_THEME;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;

  const rotationOffset = getAscendantOffset(chart.angles.Asc);

  const svgParts: string[] = [];

  // 1. Header
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" 
                      xmlns:xlink="http://www.w3.org/1999/xlink" 
                      viewBox="0 0 ${width} ${height}" 
                      width="${width}" height="${height}"
                      style="background-color: ${theme.backgroundColor}">`);

  // 2. Styles and Definitions
  svgParts.push('<style>');
  svgParts.push(generateCssVariables(theme));
  svgParts.push('text { font-family: sans-serif; }');
  svgParts.push('</style>');
  
  svgParts.push('<defs>');
  svgParts.push(SVG_SYMBOLS);
  svgParts.push('</defs>');

  // 3. Components
  // Background circle for the entire wheel area
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${theme.paperColor}" />`);
  
  svgParts.push(drawZodiacWheel(cx, cy, radius, rotationOffset));
  svgParts.push(drawHouseLines(cx, cy, radius, chart.houses, rotationOffset));
  
  // Foreground center circle (The "Empty" space in the middle)
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.4}" fill="${theme.paperColor}" stroke="var(--astro-color-text)" stroke-opacity="0.1" />`);
  
  if (options.showAspects !== false) {
    svgParts.push(drawAspectLines(cx, cy, radius, chart.aspects, rotationOffset));
  }
  
  svgParts.push(drawPlanetGlyphs(cx, cy, radius, chart.bodies, chart.houses, rotationOffset));

  // 4. Footer
  svgParts.push('</svg>');

  return svgParts.join('\n');
}
