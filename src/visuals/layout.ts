/**
 * Centralized Geometric Configuration for Chart Components.
 * All values are relative to the main radius (R).
 */
export interface ChartLayout {
  // Total Radius
  radius: number;

  // Outer Ring (Zodiac)
  zodiacOuter: number;
  zodiacInner: number;
  zodiacSymbol: number;

  // Mid Ring (Planets)
  planetSymbol: number;
  planetDegree: number;
  planetTickStart: number; // Usually same as zodiacInner
  planetTickLength: number;

  // Inner Ring (Houses)
  houseRing: number;
  houseText: number;

  // Center (Aspects)
  aspectBoundary: number;
}

/**
 * Computes the absolute pixel values for the layout.
 * We can tweak the logic here to change the "proportions" of the entire library.
 */
export function computeLayout(mainRadius: number): ChartLayout {
  return {
    radius: mainRadius,
    
    // Zodiac occupies the outer 40px
    zodiacOuter: mainRadius,
    zodiacInner: mainRadius - 40,
    zodiacSymbol: mainRadius - 20,

    // Planets sit inside the zodiac
    planetSymbol: mainRadius - 65,
    planetDegree: mainRadius - 85,
    planetTickStart: mainRadius - 40,
    planetTickLength: 10,

    // House structure (using your self-corrected percentages)
    houseRing: mainRadius * 0.5,
    houseText: mainRadius * 0.45,

    // Aspects stay in the core
    aspectBoundary: mainRadius * 0.4
  };
}
