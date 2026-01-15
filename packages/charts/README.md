# @astrologer/charts

A powerful, declarative SVG rendering engine for astrological charts. This package allows you to generate high-quality, customizable vector graphics for Natal, Transit, Synastry, and completely custom chart layouts.

## Installation

```bash
pnpm install @astrologer/charts @astrologer/astro-core
```

## Quick Start

The simplest way to use the library is via the high-level factory functions.

```typescript
import { natalChart, transitChart, synastryChart } from '@astrologer/charts';

const input = {
  date: '2026-01-01T12:00:00Z',
  location: { latitude: 40.7128, longitude: -74.0060 }
};

// 1. Generate a Natal Chart SVG string
const svg = natalChart(input);

// 2. Generate a Transit Chart (Bi-Wheel)
const transitInput = { date: new Date(), location: input.location };
const transitSvg = transitChart(input, transitInput);

// 3. Generate a Synastry Chart (Bi-Wheel)
const partnerInput = { ... };
const synastrySvg = synastryChart(input, partnerInput);
```

---

## Styling System

This library uses a **CSS-first** styling approach. The SVG output contains semantic class names and CSS variables, allowing for complete visual customization without changing JavaScript code.

### Default Theme
By default, charts render with a clean, light theme.

### Dark Mode / Custom Themes
You can load a custom CSS file by passing it to the low-level `createChart` function, or by simply embedding the CSS in your HTML where the SVG is rendered.

**Key CSS Variables (The Palette):**
```css
:root {
  /* Backgrounds */
  --astro-color-bg: #ffffff;
  --astro-color-paper: #ffffff;
  --astro-color-text: #333333;

  /* Planets */
  --astro-color-sun: #FFD700;
  --astro-color-moon: #909090;
  /* ... mercury, venus, mars, etc. */

  /* Aspects */
  --astro-color-aspect-conj: #FFD700;
  --astro-color-aspect-square: #FF0000;
  --astro-color-aspect-trine: #32CD32;
  
  /* Elements */
  --astro-color-fire: #e44d2e;
  --astro-color-earth: #955e1c;
  /* ... */
}
```

**Semantic CSS Classes:**
| Class | Description |
|---|---|
| `.astro-chart` | The root SVG element. |
| `.astro-zodiac-ring` | The circles bordering the zodiac. |
| `.astro-zodiac-glyph` | The sign symbols (Aries, Taurus...). |
| `.astro-zodiac-sign-bg` | The colored background arcs for signs. |
| `.astro-house-line` | Lines separating houses. |
| `.astro-planet-symbol` | The planetary glyphs. |
| `.astro-planet-degree` | The text showing planet degrees. |
| `.astro-aspect-line` | Lines drawn in the center for aspects. |

---

## Advanced: Custom Chart Layouts

For full control over the layout (radii, rings, components), use the `createChart` engine. This is an **IoC (Inversion of Control)** system where you define the visual architecture.

```typescript
import { createChart, ChartDefinition } from '@astrologer/charts/src/visuals/core/engine';
import { calculateChart } from '@astrologer/astro-core';

const data = calculateChart({ ... });

const myLayout: ChartDefinition = {
  width: 800,
  height: 800,
  // Optional: Array of CSS file paths to inject
  themes: ['/path/to/my-dark-theme.css'], 
  components: [
    // 1. Draw a background circle
    { type: 'circle', props: { radius: 300, fill: 'var(--astro-color-paper)' } },
    
    // 2. Draw the Zodiac Wheel
    { 
      type: 'zodiacWheel', 
      props: { 
        outerRadius: 300, 
        innerRadius: 260, 
        symbolRadius: 280,
        showSignBackgrounds: true 
      } 
    },
    
    // 3. Draw a Planet Ring inside
    { 
      type: 'planetRing', 
      props: { 
        symbolRadius: 230,
        degreeRadius: 210,
        tickStartRadius: 260, // Connects to Zodiac
        tickLength: 10
      } 
    }
  ]
};

const customSvg = createChart(myLayout, data);
```

### Component Reference

#### `zodiacWheel`
Renders the 12 signs of the zodiac.
- `outerRadius` (number): Outer boundary.
- `innerRadius` (number): Inner boundary.
- `symbolRadius` (number): Radius where glyphs are placed.
- `showSignBackgrounds` (boolean): Fill sign sectors with element colors.

#### `planetRing`
Standard ring for planetary positions. Adapts to Natal (inward ticks) or Transit (outward ticks) based on geometry.
- `symbolRadius` (number): Center of planet glyphs.
- `tickStartRadius` (number): Where the tick line starts.
- `tickLength` (number): Length of the tick line towards the symbol.
- `degreeRadius` (number): Position of degree text.
- `showMinutes` (boolean): Show minutes (e.g., 15° 30').
- `minuteRadius` (number): Optional radius for minutes text.
- `showZodiacSign` (boolean): Show sign glyph between degree and minute.
- `zodiacSignRadius` (number): Optional radius for that sign glyph.
- `avoidHouses` (boolean): If true, shifts planets to avoid overlapping house cusps.

#### `stackedPlanetRing`
A specialized ring for Synastry or crowded charts that stacks planets radially to avoid collisions.
- `symbolStartRadius` (number): Baseline radius.
- `orbitStep` (number): Distance between stacked orbits.

#### `houseLines`
Renders the 12 house cusps.
- `radius` (number): Start of the line (usually center-side).
- `endRadius` (number): End of the line (usually zodiac-side).
- `showLabels` (boolean): Show house numbers.
- `angleLabelRadius` (number): Position for ASC/MC labels.

#### `aspectLines`
Renders aspect lines in the center.
- `radius` (number): The boundary radius where lines attach.
- `showAspectSymbol` (boolean): Draw the aspect glyph (square, trine) in the middle of the line.