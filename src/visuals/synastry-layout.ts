import { ChartLayout } from './layout.js';

export interface RingLayout {
  baseRadius: number; // The outer boundary for this ring
  innerRadius: number; // The inner boundary for this ring
  symbolRadius: number; // Where symbols are generally placed (within the boundaries)
  tickStart: number;
  tickLength: number;
  orbitStep: number; // For stacked/collision-resolved rings
}

export interface SynastryChartLayout extends ChartLayout {
  outerRing: RingLayout;
  innerRing: RingLayout;
}

/**
 * Computes layout for a Bi-Wheel Synastry Chart.
 * Ensures inner and outer bands have equal thickness.
 */
export function computeSynastryLayout(mainRadius: number): SynastryChartLayout {
  const zInner = mainRadius - 40; 

  // EQUAL BAND THICKNESS
  const bandThickness = 65; 

  // Person B Band (Outer)
  const pB_Start = zInner;
  const pB_End = pB_Start - bandThickness;
  
  // Person A Band (Inner)
  const pA_Start = pB_End;
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
    outerRing: {
        baseRadius: pB_Start,
        innerRadius: pB_End,
        symbolRadius: pB_Start - 25,
        tickStart: zInner,
        tickLength: 10,
        orbitStep: 18
    },

    // Person A (Inner)
    innerRing: {
        baseRadius: pA_Start,
        innerRadius: pA_End,
        symbolRadius: pA_Start - 25,
        tickStart: pA_Start,
        tickLength: 10,
        orbitStep: 18
    },

    // Default planet props (fallback, unused in synastry specific rendering usually)
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
