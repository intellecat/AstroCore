import { ChartData, BodyId } from '../../core/types.js';
import { Theme, DEFAULT_THEME, generateCssVariables } from '../theme.js';
import { getAscendantOffset } from '../geometry.js';
import { SVG_SYMBOLS } from '../symbols.js';

// --- Configuration Types ---

export interface ComponentConfig {
  type: string;
  // Dynamic binding instructions
  dataSource?: 'primary' | 'secondary' | 'combined'; 
  // Static visual properties (radius, ticks, etc.)
  props?: Record<string, any>;
}

export interface ChartDefinition {
  width?: number;
  height?: number;
  theme?: Theme;
  components: ComponentConfig[];
}

// --- Runtime Context ---

export interface RenderContext {
  primary: ChartData;
  secondary?: ChartData; // For synastry/transit
  width: number;
  height: number;
  cx: number;
  cy: number;
  radius: number;
  rotationOffset: number; // Derived from primary Ascendant
  theme: Theme;
}

// --- Component Registry ---

export type RendererAdapter = (ctx: RenderContext, config: ComponentConfig) => string;

const registry: Record<string, RendererAdapter> = {};

export function registerComponent(type: string, adapter: RendererAdapter) {
  registry[type] = adapter;
}

// --- The Factory ---

export function createChart(
  definition: ChartDefinition, 
  primaryData: ChartData, 
  secondaryData?: ChartData
): string {
  const width = definition.width ?? 600;
  const height = definition.height ?? 600;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;
  const theme = definition.theme ?? DEFAULT_THEME;

  // 1. Prepare Context
  const context: RenderContext = {
    primary: primaryData,
    secondary: secondaryData,
    width,
    height,
    cx,
    cy,
    radius,
    rotationOffset: getAscendantOffset(primaryData.angles.Asc),
    theme
  };

  const svgParts: string[] = [];

  // 2. Header & Defs
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 ${width} ${height}" 
                      width="${width}" height="${height}"
                      style="background-color: ${theme.backgroundColor}">`);
  svgParts.push('<style>');
  svgParts.push(generateCssVariables(theme));
  svgParts.push('text { font-family: sans-serif; }');
  svgParts.push('</style>');
  
  svgParts.push('<defs>');
  svgParts.push(SVG_SYMBOLS);
  svgParts.push('</defs>');

  // 3. Render Components
  definition.components.forEach(comp => {
    const adapter = registry[comp.type];
    if (adapter) {
      svgParts.push(adapter(context, comp));
    } else {
      console.warn(`No adapter registered for component type: ${comp.type}`);
    }
  });

  svgParts.push('</svg>');
  return svgParts.join('\n');
}
