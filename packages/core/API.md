# API Reference: @astrologer/astro-core

This document provides a comprehensive list of all public functions available in the `@astrologer/astro-core` package. As a **functional library**, all functions are pure, stateless, and do not mutate input data.

---

## Table of Contents
- [Main Calculation](#main-calculation)
- [Data Structures](#data-structures)
- [Celestial Bodies](#celestial-bodies)
- [Houses & Angles](#houses--angles)
- [Aspects](#aspects)
- [Composite & Synastry](#composite--synastry)
- [Returns & Cycles](#returns--cycles)
- [Analysis & Distribution](#analysis--distribution)
- [Time & Ephemeris Utilities](#time--ephemeris-utilities)
- [Global Configuration](#global-configuration)

---

## Main Calculation

### `calculateChart(input: ChartInput): ChartData`
The primary high-level function to generate a complete astrological snapshot.
- **Parameters:** `ChartInput`
- **Returns:** `ChartData`

---

## Data Structures

### `ChartInput`
The configuration for calculating a chart.

| Property | Type | Description |
|---|---|---|
| `date` | `string \| Date \| DateTime` | The UTC moment for the chart. |
| `location` | `GeoLocation` | `{ latitude, longitude, altitude? }`. |
| `houseSystem` | `HouseSystem` | (Optional) Defaults to `Placidus` ('P'). |
| `zodiacType` | `ZodiacType` | (Optional) `Tropical` or `Sidereal`. |
| `siderealMode` | `SiderealMode` | (Optional) Ayanamsa system if using Sidereal. |
| `perspective` | `Perspective` | (Optional) `Geocentric`, `Heliocentric`, `Topocentric`. |
| `bodies` | `BodyId[]` | (Optional) Custom list of bodies to calculate and aspect. |

### `ChartData`
The complete result of an astrological calculation.

| Property | Type | Description |
|---|---|---|
| `bodies` | `CelestialPosition[]` | Array of planetary data and positions. |
| `houses` | `HouseCusp[]` | Array of the 12 house cusp longitudes. |
| `angles` | `ChartAngles` | Core chart angles (Asc, MC, etc). |
| `aspects` | `Aspect[]` | Calculated aspects between the bodies. |
| `lunarPhase` | `LunarPhase` | Phase name and illumination of the moon. |
| `meta` | `Object` | Echoes the input configuration and used defaults. |

### `CelestialPosition`
Detail for a single planetary body.

| Property | Type | Description |
|---|---|---|
| `id` | `BodyId` | Unique identifier (e.g. `Sun`). |
| `name` | `string` | Display name. |
| `longitude` | `number` | 0-360° Ecliptic Longitude. |
| `degree` | `number` | 0-30° position within the sign. |
| `sign` | `string` | Name of the Zodiac Sign. |
| `house` | `number` | The house number (1-12) the body falls into. |
| `isRetrograde`| `boolean` | Whether the body is currently in retrograde. |
| `speed` | `number` | Degrees per day. |
| `latitude` | `number` | Ecliptic latitude. |
| `declination` | `number` | Equatorial declination. |
| `distance` | `number` | Distance from Earth in AU. |

---

## Celestial Bodies

### `calculatePlanets(jd, houseCusps, angles, flags?, bodies?)`
Calculates positions for a set of celestial bodies.
- **Returns:** `CelestialPosition[]`.

### `getBodyPosition(body, jd, flags?)`
Low-level wrapper for Swiss Ephemeris calculations.
- **Returns:** `SweCalcResult`.

### `calculateLunarPhase(sunLon, moonLon)`
Determines the phase of the moon.
- **Returns:** `LunarPhase`.

---

## Houses & Angles

### `calculateHousesAndAngles(jd, lat, lng, system)`
Calculates the 12 house cusps and the primary angles.
- **Returns:** `{ houses: HouseCusp[], angles: ChartAngles }`.

### `getHouses(jd, lat, lng, system)`
Low-level wrapper for Swiss Ephemeris house calculations.
- **Returns:** `SweHouseResult`.

---

## Aspects

### `calculateAspects(bodies)`
Finds all major aspects between a single set of bodies (Natal aspects).
- **Returns:** `Aspect[]`.

### `calculateDualAspects(bodiesA, bodiesB)`
Calculates aspects between two different sets of bodies. Used for **Synastry** or **Transits**.
- **Returns:** `Aspect[]`.

---

## Composite & Synastry

### `calculateCompositeChart(chartA, chartB)`
Calculates a midpoint composite chart based on two existing chart data objects.
- **Returns:** `Partial<ChartData>`.

### `calculateRelationshipScore(chartA, chartB)`
Analyzes synastry aspects to provide a numerical compatibility summary.
- **Returns:** `RelationshipScore`.

### `calculateHouseOverlay(planets, houses)`
Determines the distribution of one person's planets into another person's houses.
- **Returns:** `Record<number, number>` (House Number -> Planet Count).

---

## Returns & Cycles

### `calculatePlanetaryReturn(body, targetLongitude, approximateDate)`
Calculates the exact moment (Julian Day) a planet returns to a specific longitude.
- **Returns:** `number` (Julian Day).

---

## Analysis & Distribution

### `calculateDistribution(bodies, angles, customWeights?)`
Tallies planets by Element and Quality using a weighted scoring system.
- **Returns:** `DistributionScore`.

### `calculateSynastryDistribution(bodiesA, anglesA, bodiesB, anglesB)`
Calculates the combined weighted distribution for two charts.
- **Returns:** `DistributionPercentage`.

---

## Time & Ephemeris Utilities

### `generateEphemerisRange(input: EphemerisRangeInput)`
Generates a time-series of astrological snapshots over a period.
- **Returns:** `EphemerisStep[]`.

### `getJulianDay(date)`
Converts various date formats to a Julian Day number.

### `findNextEclipse(date, type)`
Predicts the next Solar or Lunar eclipse.
- **Returns:** `EclipseResult`.

---

## Global Configuration

### `configureSidereal(mode: SiderealMode)`
Sets the global ayanamsa system.

### `configureTopocentric(location: GeoLocation)`
Configures the observer's position for parallax corrections.
