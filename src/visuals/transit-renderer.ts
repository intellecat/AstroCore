import { ChartData, BodyId } from '../core/types.js';
import { getAscendantOffset } from './geometry.js';
import { DEFAULT_THEME, Theme, generateCssVariables } from './theme.js';
import { SVG_SYMBOLS } from './symbols.js';
import { computeTransitLayout } from './transit-layout.js';
import { drawZodiacWheel } from './components/ZodiacWheel.js';
import { drawHouseLines } from './components/HouseLines.js';
import { drawPlanetGlyphs } from './components/PlanetGlyphs.js';
import { drawTransitPlanetGlyphs } from './components/TransitPlanetGlyphs.js';
import { drawAspectLines } from './components/AspectLines.js';
import { drawDegreeRings } from './components/DegreeRings.js';
import { RenderOptions } from './renderer.js';
import { calculateDualAspects } from '../core/aspects.js';

const MAIN_PLANETS = [
  BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
  BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto
];

export function renderTransitChart(natalChart: ChartData, transitChart: ChartData, options: RenderOptions = {}): string {
  const width = options.width ?? 600;
  const height = options.height ?? 600;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;
  const theme = options.theme ?? DEFAULT_THEME;

  const layout = computeTransitLayout(radius);
  const rotationOffset = getAscendantOffset(natalChart.angles.Asc); 

  // Filter for Main Planets only
  const transitBodies = transitChart.bodies.filter(b => MAIN_PLANETS.includes(b.id));
  const natalBodies = natalChart.bodies.filter(b => MAIN_PLANETS.includes(b.id));

  const transitAspects = calculateDualAspects(transitBodies, natalBodies);

  const svgParts: string[] = [];

  // Header
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: ${theme.backgroundColor}">`);
  svgParts.push('<style>', generateCssVariables(theme), 'text { font-family: sans-serif; }</style>');
  svgParts.push('<defs>', SVG_SYMBOLS, '</defs>');

  // 1. Background
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.radius}" fill="${theme.paperColor}" />`);
  
  // 2. Transit Ring Boundary
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.transitRingInner}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.2" />`);

  // 3. Inner Natal Chart
  svgParts.push(drawZodiacWheel(cx, cy, rotationOffset, layout));
  svgParts.push(drawDegreeRings(cx, cy, rotationOffset, layout));
  svgParts.push(drawHouseLines(cx, cy, natalChart.houses, rotationOffset, layout));
  
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.aspectBoundary}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.1" />`);
  
  if (options.showAspects !== false) {
    svgParts.push(drawAspectLines(cx, cy, transitAspects, rotationOffset, layout));
  }
  
  svgParts.push(drawPlanetGlyphs(cx, cy, natalChart.bodies, natalChart.houses, rotationOffset, layout, options.markerRenderer));

  // 4. Outer Transit Planets (Show ALL, or just Main? Usually show all, but aspect only main)
  // Let's show all transit planets as glyphs, but aspect lines only for main.
  svgParts.push(drawTransitPlanetGlyphs(cx, cy, transitChart.bodies, natalChart.houses, rotationOffset, layout));

  svgParts.push('</svg>');
  return svgParts.join('\n');
}
