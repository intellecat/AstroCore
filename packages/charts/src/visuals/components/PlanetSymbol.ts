import { CelestialPosition, BodyId } from '@astrologer/astro-core';

export const UNICODE_MAP: Record<string, string> = {
  [BodyId.Sun]: '☉', [BodyId.Moon]: '☽', [BodyId.Mercury]: '☿', [BodyId.Venus]: '♀', [BodyId.Mars]: '♂',
  [BodyId.Jupiter]: '♃', [BodyId.Saturn]: '♄', [BodyId.Uranus]: '♅', [BodyId.Neptune]: '♆', [BodyId.Pluto]: '♇',
  [BodyId.Chiron]: '⚷', [BodyId.MeanNode]: '☊', [BodyId.TrueNode]: '☊', [BodyId.SouthNode]: '☋',
  [BodyId.LilithMean]: '⚸', [BodyId.LilithTrue]: '⚸', [BodyId.ParsFortunae]: '⊗',
  [BodyId.Vertex]: 'Vx', [BodyId.AntiVertex]: 'Av',
};

export interface PlanetSymbolConfig {
    x: number;
    y: number;
    fontSize?: number;
    className?: string;
    showRetrograde?: boolean;
}

export function drawPlanetSymbol(
    planet: CelestialPosition,
    config: PlanetSymbolConfig
): string {
    const char = UNICODE_MAP[planet.id] || '?';
    const fontSize = config.fontSize ?? 20;
    const className = config.className ?? 'astro-planet-symbol';
    const showRetrograde = config.showRetrograde ?? true;
    
    let svg = `<g class="astro-planet-symbol-group">`;
    
    svg += `<text x="${config.x}" y="${config.y}" font-size="${fontSize}" class="${className}">${char}</text>`;
    
    // m/t indicators
    if (planet.id.includes('Mean') || planet.id.includes('True')) {
        const indicator = planet.id.includes('Mean') ? 'm' : 't';
        svg += `<text x="${config.x + 8}" y="${config.y - 8}" class="astro-planet-indicator">${indicator}</text>`;
    }
    
    // Retrograde Indicator (r)
    if (showRetrograde && planet.isRetrograde) {
        svg += `<text x="${config.x + 6}" y="${config.y + 2}" font-size="0.6em" class="astro-planet-retrograde">r</text>`;
    }
    
    svg += `</g>`;
    return svg;
}
