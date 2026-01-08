/**
 * Centralized Geometric Configuration for Chart Components.
 */
export interface ChartLayout {
  radius: number;

  // Outer Ring (Zodiac)
  zodiacOuter: number;
  zodiacInner: number;
  zodiacSymbol: number;

  // Degree Scale (Ticks)
  degreeRing: number;
  degreeTickSmall: number;
  degreeTickMedium: number;
  degreeTickLarge: number;

  // Mid Ring (Planets)
  planetSymbol: number;
  planetDegree: number;
  planetTickStart: number;
  planetTickLength: number;

  // Inner Ring (Houses)
  houseRing: number;
  houseText: number;
  angleLabelRadius: number;

  // Center (Aspects)
  aspectBoundary: number;
}

export function computeLayout(mainRadius: number): ChartLayout {
  return {
    radius: mainRadius,
    
    zodiacOuter: mainRadius,
    zodiacInner: mainRadius - 45, // Slightly wider for ticks
    zodiacSymbol: mainRadius - 22,

    degreeRing: mainRadius - 45,
    degreeTickSmall: 3,
    degreeTickMedium: 6,
    degreeTickLarge: 10,

    planetSymbol: mainRadius - 75,
    planetDegree: mainRadius - 95,
    planetTickStart: mainRadius - 45,
    planetTickLength: 10,

    houseRing: mainRadius * 0.5,
    houseText: mainRadius * 0.45,
    angleLabelRadius: mainRadius * 0.45, // Moved inward

    aspectBoundary: mainRadius * 0.4
  };
}