# @astrologer/astro-core

A **functional**, high-precision astrological calculation library powered by Swiss Ephemeris. This library provides pure functions for calculating charts, analyzing relationships, and generating ephemerides.

## Philosophy

- **Functional:** All functions are pure and stateless. Inputs -> Outputs.
- **Precision:** Uses `@swisseph/core` for astronomical accuracy.
- **Type-Safe:** First-class TypeScript support with comprehensive types.

## Installation

```bash
pnpm install @astrologer/astro-core
```

## Initialization

Before performing any calculations, you must initialize the library with the appropriate Swiss Ephemeris adapter.

### Node.js
```typescript
import { setSwissEphemeris } from '@astrologer/astro-core';
import * as swe from '@swisseph/node';

// Initialize with the Node.js adapter
setSwissEphemeris(swe);
```

### Browser
```typescript
import { setSwissEphemeris } from '@astrologer/astro-core';
import { SwissEphemeris } from '@swisseph/browser';

const swe = new SwissEphemeris();
await swe.init(); // WASM initialization
setSwissEphemeris(swe);
```

## Main API

### `calculateChart(input: ChartInput): ChartData`
The primary entry point. Calculates a complete astrological chart snapshot.

```typescript
import { calculateChart } from '@astrologer/astro-core';

const chart = calculateChart({
  date: '2026-01-01T12:00:00Z',
  location: { latitude: 40.7, longitude: -74.0 }
});
```

## Core Functions

These functions are used internally by `calculateChart` but can be used independently for granular control.

### Planets & Points
- **`calculatePlanets(jd, houses, angles, flags?, bodies?)`**: Calculates positions for specified bodies.
- **`calculateLunarPhase(sunLon, moonLon)`**: Returns moon phase, illumination, and age.
- **`getBodyPosition(body, jd, flags?)`**: Low-level wrapper for Swiss Ephemeris position.

### Houses & Angles
- **`calculateHousesAndAngles(jd, lat, lng, system)`**: Returns house cusps (1-12) and angles (Asc, MC, Vertex, etc).
- **`getHouses(jd, lat, lng, system)`**: Low-level wrapper for Swiss Ephemeris houses.

### Aspects
- **`calculateAspects(bodies)`**: Finds all major aspects between a list of bodies.
- **`calculateDualAspects(bodiesA, bodiesB)`**: Finds aspects between two different sets of bodies (Synastry/Transit).
- **`getAspect(body1, body2)`**: Checks if two specific bodies form an aspect.

## Advanced Charts

### Synastry & Relationships
- **`calculateCompositeChart(dateA, locA, dateB, locB)`**: Calculates a midpoint composite chart.
- **`calculateRelationshipScore(chartA, chartB)`**: (Analysis) Returns a compatibility score based on synastry aspects.

### Forecasting
- **`calculateSolarReturn(birthDate, returnYear, location)`**: Calculates the exact moment of the Solar Return.
- **`calculateLunarReturn(birthDate, returnDate, location)`**: Calculates the Lunar Return.
- **`generateEphemerisRange(input)`**: Generates a time-series of chart data over a date range.

### Analysis
- **`calculateElementDistribution(bodies)`**: Returns the count/percentage of planets in Fire, Earth, Air, Water.
- **`calculateQualityDistribution(bodies)`**: Returns the count/percentage of planets in Cardinal, Fixed, Mutable.
- **`calculatePolarityDistribution(bodies)`**: Returns the count/percentage of planets in Yin (Feminine) vs Yang (Masculine).

## Utilities

- **`getJulianDay(date)`**: Converts string/Date/DateTime to Julian Day Number.
- **`findNextEclipse(date, type)`**: Finds the next Solar or Lunar eclipse.
- **`configureSidereal(mode)`**: Sets the global sidereal mode (e.g., Fagan-Bradley, Lahiri).
- **`configureTopocentric(location)`**: Sets the global topocentric observer location.

## Types & Enums

Import these to ensure type safety in your application.

```typescript
import { 
  BodyId,       // Sun, Moon, Mercury...
  HouseSystem,  // Placidus, Koch, WholeSign...
  AspectType,   // Conjunction, Square...
  ZodiacType    // Tropical, Sidereal
} from '@astrologer/astro-core';
```