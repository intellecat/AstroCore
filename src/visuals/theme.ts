export interface Theme {
  backgroundColor: string;
  paperColor: string;
  textColor: string;
  
  // Zodiac Colors
  zodiacRings: string[];
  zodiacIcons: string[];
  
  // Planet Colors
  sun: string;
  moon: string;
  mercury: string;
  venus: string;
  mars: string;
  jupiter: string;
  saturn: string;
  uranus: string;
  neptune: string;
  pluto: string;
  chiron: string;
  nodes: string;
  lilith: string;
  
  // Aspect Colors
  aspectConj: string;
  aspectOpp: string;
  aspectTrine: string;
  aspectSquare: string;
  aspectSextile: string;
  aspectMinor: string;
  
  // House Colors
  houseLines: string;
  houseNumbers: string;
  angleLines: string;
}

export const DEFAULT_THEME: Theme = {
  backgroundColor: '#ffffff',
  paperColor: '#ffffff',
  textColor: '#333333',
  
  zodiacRings: ['#d4af37', '#b8860b', '#ffd700'],
  zodiacIcons: ['#333333', '#333333', '#333333', '#333333', '#333333', '#333333', '#333333', '#333333', '#333333', '#333333', '#333333', '#333333'],
  
  sun: '#FFD700',
  moon: '#909090',
  mercury: '#87CEEB',
  venus: '#FF69B4',
  mars: '#FF4500',
  jupiter: '#DAA520',
  saturn: '#696969',
  uranus: '#40E0D0',
  neptune: '#4169E1',
  pluto: '#8B0000',
  chiron: '#9ACD32',
  nodes: '#A52A2A',
  lilith: '#000000',
  
  aspectConj: '#FFD700',
  aspectOpp: '#FF4500',
  aspectTrine: '#32CD32',
  aspectSquare: '#FF0000',
  aspectSextile: '#1E90FF',
  aspectMinor: '#A9A9A9',
  
  houseLines: '#D3D3D3',
  houseNumbers: '#666666',
  angleLines: '#333333'
};

const PLANET_VARS = {
  sun: '--astro-color-sun',
  moon: '--astro-color-moon',
  mercury: '--astro-color-mercury',
  venus: '--astro-color-venus',
  mars: '--astro-color-mars',
  jupiter: '--astro-color-jupiter',
  saturn: '--astro-color-saturn',
  uranus: '--astro-color-uranus',
  neptune: '--astro-color-neptune',
  pluto: '--astro-color-pluto',
  chiron: '--astro-color-chiron',
  'mean-node': '--astro-color-mean-node',
  'true-node': '--astro-color-true-node',
  'lilith-mean': '--astro-color-mean-lilith',
  'lilith-true': '--astro-color-mean-lilith',
  vertex: '--astro-color-vertex',
  'anti-vertex': '--astro-color-anti-vertex',
  'pars-fortunae': '--astro-color-pars-fortunae'
};

const PLANET_CSS = Object.entries(PLANET_VARS).map(([key, _var]) => `
  .astro-planet-${key} { fill: var(${_var}); stroke: var(${_var}); }
  .astro-planet-${key} .astro-marker { stroke: var(${_var}); }
`).join('\n');

export const BASE_STYLES = `
  /* Global */
  text {
    font-family: sans-serif;
    fill: var(--astro-color-text);
  }

  /* Zodiac Wheel */
  .astro-zodiac-ring {
    fill: none;
    stroke: var(--astro-color-text);
    stroke-opacity: 0.2;
    stroke-width: 1px;
  }
  .astro-zodiac-line {
    stroke: var(--astro-color-text);
    stroke-opacity: 0.2;
    stroke-width: 1px;
  }
  .astro-zodiac-glyph {
    font-size: 22px;
    text-anchor: middle;
    dominant-baseline: central;
    fill: var(--astro-color-text);
  }

  /* Degree Rings */
  .astro-degree-tick {
    stroke: var(--astro-color-text);
    stroke-width: 0.5px;
    opacity: 0.2;
  }
  .astro-degree-tick.major {
    opacity: 0.5;
  }
  .astro-degree-tick.medium {
    opacity: 0.3;
  }

  /* House Lines */
  .astro-house-ring {
    fill: none;
    stroke: var(--astro-color-text);
    stroke-opacity: 0.1;
  }
  .astro-house-line {
    stroke: var(--astro-color-text);
    stroke-width: 0.8px;
    opacity: 0.2;
    stroke-dasharray: 3,3;
  }
  .astro-house-line.angle {
    stroke-width: 1.5px;
    opacity: 0.5;
    stroke-dasharray: none;
  }
  .astro-house-label {
    fill: var(--astro-color-text);
    font-size: 8px;
    text-anchor: middle;
    dominant-baseline: middle;
    opacity: 0.4;
  }
  .astro-angle-label {
    fill: var(--astro-color-text);
    font-size: 7px;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: middle;
    opacity: 0.6;
  }
  .astro-angle-degree {
    fill: var(--astro-color-text);
    font-size: 6px;
    text-anchor: middle;
    dominant-baseline: middle;
    opacity: 0.4;
  }

  /* Planet Ring */
  .astro-planet-symbol {
    font-size: 20px;
    text-anchor: middle;
    dominant-baseline: central;
    fill: inherit; /* Inherit from group */
    stroke: none;
  }
  .astro-planet-tick {
    stroke-width: 0.8px;
    stroke-opacity: 0.6;
  }
  .astro-planet-indicator {
    font-size: 8px;
    fill: inherit; /* Inherit from group */
    stroke: none;
  }
  .astro-planet-degree {
    font-size: 8px;
    text-anchor: middle;
    dominant-baseline: middle;
    opacity: 0.6;
    fill: var(--astro-color-text);
    stroke: none;
  }

  /* Markers */
  .astro-marker {
    stroke-width: 0.8px; 
    stroke-opacity: 0.4;
    stroke: var(--astro-color-text); /* Fallback if not overridden */
  }

  /* Aspect Lines */
  .astro-aspect-line {
    stroke-width: 1px;
    stroke-opacity: 0.6;
    fill: none;
  }

  /* Semantic Planet Colors */
  ${PLANET_CSS}
`;

export function generateCssVariables(theme: Theme): string {
  return `
    :root {
      --astro-color-bg: ${theme.backgroundColor};
      --astro-color-paper: ${theme.paperColor};
      --astro-color-text: ${theme.textColor};
      --astro-color-sun: ${theme.sun};
      --astro-color-moon: ${theme.moon};
      --astro-color-mercury: ${theme.mercury};
      --astro-color-venus: ${theme.venus};
      --astro-color-mars: ${theme.mars};
      --astro-color-jupiter: ${theme.jupiter};
      --astro-color-saturn: ${theme.saturn};
      --astro-color-uranus: ${theme.uranus};
      --astro-color-neptune: ${theme.neptune};
      --astro-color-pluto: ${theme.pluto};
      --astro-color-chiron: ${theme.chiron};
      --astro-color-mean-node: ${theme.nodes};
      --astro-color-true-node: ${theme.nodes};
      --astro-color-mean-lilith: ${theme.lilith};
      --astro-color-vertex: #666666;
      --astro-color-anti-vertex: #666666;
      --astro-color-pars-fortunae: ${theme.textColor};
      
      --astro-color-aspect-conj: ${theme.aspectConj};
      --astro-color-aspect-opp: ${theme.aspectOpp};
      --astro-color-aspect-trine: ${theme.aspectTrine};
      --astro-color-aspect-square: ${theme.aspectSquare};
      --astro-color-aspect-sextile: ${theme.aspectSextile};
      --astro-color-aspect-minor: ${theme.aspectMinor};
      
      ${theme.zodiacIcons.map((color, i) => `--astro-color-zodiac-${i}: ${color};`).join('\n')}
    }
  `;
}