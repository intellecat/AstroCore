import { ChartData } from '../core/types.js';
import { getAscendantOffset } from './geometry.js';
import { DEFAULT_THEME, Theme, generateCssVariables } from './theme.js';
import { SVG_SYMBOLS } from './symbols.js';
import { computeLayout } from './layout.js';
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

  // 1. COMPUTE SYSTEMATIC LAYOUT
  const layout = computeLayout(radius);

  const rotationOffset = getAscendantOffset(chart.angles.Asc);
  const svgParts: string[] = [];

  // Header
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" 
                      xmlns:xlink="http://www.w3.org/1999/xlink" 
                      viewBox="0 0 ${width} ${height}" 
                      width="${width}" height="${height}"
                      style="background-color: ${theme.backgroundColor}">`);

  // Styles
  svgParts.push('<style>');
  svgParts.push(generateCssVariables(theme));
  svgParts.push('text { font-family: sans-serif; }');
  svgParts.push('</style>');
  
  svgParts.push('<defs>');
  svgParts.push(SVG_SYMBOLS);
  svgParts.push('</defs>');

  // 2. Render Components using Layout Config
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.radius}" fill="${theme.paperColor}" />`);
  
  svgParts.push(drawZodiacWheel(cx, cy, rotationOffset, layout));
  svgParts.push(drawHouseLines(cx, cy, chart.houses, rotationOffset, layout));
  
  // Foreground center circle (Inside the house number ring)
  // We can make this dynamic too: 0.8 * layout.aspectBoundary or similar
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.aspectBoundary * 1}" fill="${theme.paperColor}" stroke="var(--astro-color-text)" stroke-opacity="0.1" />`);
  
  if (options.showAspects !== false) {
    svgParts.push(drawAspectLines(cx, cy, chart.aspects, rotationOffset, layout));
  }
  
  svgParts.push(drawPlanetGlyphs(cx, cy, chart.bodies, chart.houses, rotationOffset, layout));

  // Footer
  svgParts.push('</svg>');

  return svgParts.join('\n');
}