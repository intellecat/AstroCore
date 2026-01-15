import { ChartData } from '@astrologer/astro-core';
import { getAscendantOffset } from '../geometry.js';
import { SVG_SYMBOLS } from '../symbols.js';
import { loadTheme } from '../theme-loader.js';

// --- Configuration Types ---

export interface ComponentConfig {
  type: string;
  dataSource?: 'primary' | 'secondary' | 'combined'; 
  props?: Record<string, any>;
}

export interface ChartDefinition {
  width?: number;
  height?: number;
  themes?: string[]; // Array of filenames or paths
  components: ComponentConfig[];
}

// --- Runtime Context ---

export interface RenderContext {
  primary: ChartData;
  secondary?: ChartData;
  width: number;
  height: number;
  cx: number;
  cy: number;
  radius: number;
  rotationOffset: number;
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

  // 1. Prepare Context
  const context: RenderContext = {
    primary: primaryData,
    secondary: secondaryData,
    width,
    height,
    cx,
    cy,
    radius,
    rotationOffset: getAscendantOffset(primaryData.angles.Asc)
  };

  const svgParts: string[] = [];

  // 2. Header & Styles
  const cssContent = loadTheme(definition.themes);

  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" 
                      class="astro-chart"
                      viewBox="0 0 ${width} ${height}" 
                      width="${width}" height="${height}">`);
  
  svgParts.push('<style>');
  svgParts.push(cssContent);
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