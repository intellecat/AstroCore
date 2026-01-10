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
