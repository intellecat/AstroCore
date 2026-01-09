import { ChartData, BodyId } from '../core/types.js';
import { getAscendantOffset } from './geometry.js';
import { DEFAULT_THEME, Theme, generateCssVariables } from './theme.js';
import { SVG_SYMBOLS } from './symbols.js';
import { computeSynastryLayout } from './synastry-layout.js';
import { drawZodiacWheel } from './components/ZodiacWheel.js';
import { drawHouseLines } from './components/HouseLines.js';
import { drawSynastryPlanetGlyphs } from './components/SynastryPlanetGlyphs.js';
import { drawAspectLines } from './components/AspectLines.js';
import { drawDegreeRings } from './components/DegreeRings.js';
import { RenderOptions } from './renderer.js';
import { calculateDualAspects } from '../core/aspects.js';

const MAIN_PLANETS = [
  BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
  BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto
];

export function renderSynastryChart(chartA: ChartData, chartB: ChartData, options: RenderOptions = {}): string {
  const width = options.width ?? 700;
  const height = options.height ?? 700;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;
  const theme = options.theme ?? DEFAULT_THEME;

  const layout = computeSynastryLayout(radius);
  const rotationOffset = getAscendantOffset(chartA.angles.Asc);

  const bodiesA = chartA.bodies.filter(b => MAIN_PLANETS.includes(b.id));
  const bodiesB = chartB.bodies.filter(b => MAIN_PLANETS.includes(b.id));
  const aspects = calculateDualAspects(bodiesA, bodiesB);

  const svgParts: string[] = [];

  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: ${theme.backgroundColor}">`);
  svgParts.push('<style>', generateCssVariables(theme), 'text { font-family: sans-serif; }</style>');
  svgParts.push('<defs>', SVG_SYMBOLS, '</defs>');

  // 1. Background
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.radius}" fill="${theme.paperColor}" />`);
  
  // 2. Zodiac & Scales
  svgParts.push(drawZodiacWheel(cx, cy, rotationOffset, layout));
  svgParts.push(drawDegreeRings(cx, cy, rotationOffset, layout));

  // 3. Person B (Outer Ring)
  svgParts.push(drawHouseLines(cx, cy, chartB.houses, rotationOffset, layout, {
      startRadius: layout.innerPersonRing, 
      endRadius: layout.zodiacInner,                
      showLabels: true,
      labelRadius: layout.innerPersonRing + 8 
  }));

  svgParts.push(drawSynastryPlanetGlyphs(cx, cy, chartB.bodies, true, rotationOffset, layout));

  // 4. Separator
//   svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.innerPersonRing}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.3" />`);

  // 5. Person A (Inner Ring)
  svgParts.push(drawHouseLines(cx, cy, chartA.houses, rotationOffset, layout, {
      startRadius: layout.houseRing,
      endRadius: layout.innerPersonRing,
      showLabels: true,
      labelRadius: layout.houseRing + 8
  }));

  svgParts.push(drawSynastryPlanetGlyphs(cx, cy, chartA.bodies, false, rotationOffset, layout));

  // 6. Aspects
  svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${layout.aspectBoundary}" fill="none" stroke="var(--astro-color-text)" stroke-opacity="0.1" />`);
  
  if (options.showAspects !== false) {
      svgParts.push(drawAspectLines(cx, cy, aspects, rotationOffset, layout));
  }

  svgParts.push('</svg>');
  return svgParts.join('\n');
}
