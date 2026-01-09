import { ChartLayout } from './layout.js';

export interface SynastryChartLayout extends ChartLayout {
  // Subject B (Outer Person)
  outerPersonRing: number;
  outerPersonSymbol: number;
  outerPersonTickStart: number;
  outerPersonTickLength: number;
  outerPersonOrbitStep: number; 

  // Subject A (Inner Person)
  innerPersonRing: number;
  innerPersonSymbol: number;
  innerPersonTickStart: number;
  innerPersonTickLength: number;
  innerPersonOrbitStep: number; 
}

/**
 * Computes layout for a Bi-Wheel Synastry Chart.
 * Ensures inner and outer bands have equal thickness.
 */
export function computeSynastryLayout(mainRadius: number): SynastryChartLayout {
  const zInner = mainRadius - 40; 

  // EQUAL BAND THICKNESS
  const bandThickness = 65; 
  const spacer = 0;

  // Person B Band (Outer)
  const pB_Start = zInner;
  const pB_End = pB_Start - bandThickness;
  
  // Person A Band (Inner)
  const pA_Start = pB_End - spacer;
  const pA_End = pA_Start - bandThickness;

  const houseRing = pA_End;

  return {
    radius: mainRadius,
    
    zodiacOuter: mainRadius,
    zodiacInner: zInner,
    zodiacSymbol: mainRadius - 20,

    degreeRing: zInner,
    degreeTickSmall: 3,
    degreeTickMedium: 5,
    degreeTickLarge: 8,

    // Person B (Outer)
    outerPersonRing: pB_Start,
    outerPersonSymbol: pB_Start - 25,
    outerPersonTickStart: zInner,
    outerPersonTickLength: 10,
    outerPersonOrbitStep: 18,

    // Person A (Inner)
    innerPersonRing: pA_Start,
    innerPersonSymbol: pA_Start - 25,
    innerPersonTickStart: pA_Start,
    innerPersonTickLength: 10,
    innerPersonOrbitStep: 18,

    // Default planet props (fallback)
    planetSymbol: 0,
    planetDegree: 0,
    planetTickStart: 0,
    planetTickLength: 0,

    // Inner House Ring
    houseRing: houseRing,
    houseText: houseRing - 15,
    angleLabelRadius: houseRing - 25,

    aspectBoundary: houseRing
  };
}
