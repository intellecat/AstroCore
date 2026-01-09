import { ChartLayout } from './layout.js';

export interface TransitChartLayout extends ChartLayout {
  // Transit Ring (Outer)
  transitRingInner: number;
  transitRingOuter: number;
  transitSymbol: number;
  transitDegree: number;
  transitTickStart: number;
  transitTickLength: number;
}

/**
 * Computes layout for a Bi-Wheel Transit Chart.
 * Compresses the inner chart to make room for the outer transit ring.
 */
export function computeTransitLayout(mainRadius: number): TransitChartLayout {
  // 1. Reserve outer 15% for Transit Ring
  const transitBand = mainRadius * 0.15;
  const innerRadius = mainRadius - transitBand;

  return {
    radius: mainRadius,

    // Transit Ring (The new outer band)
    transitRingOuter: mainRadius,
    transitRingInner: innerRadius,
    transitSymbol: mainRadius - 20,
    transitDegree: mainRadius - 8,  // Very outer edge
    transitTickStart: innerRadius,
    transitTickLength: 10,

    // --- Inner Natal Chart (Scaled down) ---
    
    // Zodiac now sits just inside the transit ring
    zodiacOuter: innerRadius,
    zodiacInner: innerRadius - 35,
    zodiacSymbol: innerRadius - 17,

    // Degree Scale
    degreeRing: innerRadius - 35,
    degreeTickSmall: 3,
    degreeTickMedium: 5,
    degreeTickLarge: 8,

    // Natal Planets
    planetSymbol: innerRadius - 60,
    planetDegree: innerRadius - 75,
    planetTickStart: innerRadius - 35,
    planetTickLength: 8,

    // House Ring
    houseRing: innerRadius * 0.55,
    houseText: innerRadius * 0.5,
    angleLabelRadius: innerRadius * 0.52,

    // Center Aspects
    aspectBoundary: innerRadius * 0.45
  };
}
