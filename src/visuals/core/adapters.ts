import { registerComponent, RenderContext, ComponentConfig } from './engine.js';
import { drawZodiacWheel } from '../components/ZodiacWheel.js';
import { drawDegreeRings } from '../components/DegreeRings.js';
import { drawHouseLines } from '../components/HouseLines.js';
import { drawOuterPlanetRing, OuterRingLayout } from '../components/OuterPlanetRing.js';
import { drawStackedPlanetRing, StackedRingLayout } from '../components/StackedPlanetRing.js';
import { drawAspectLines } from '../components/AspectLines.js';
import { calculateDualAspects } from '../../core/aspects.js';
import { ChartData, BodyId } from '../../core/types.js';

// --- Helpers ---

// Helper to construct a Layout-like object that the old components expect
function getLayoutProps(ctx: RenderContext, props: any) {
  // Merge context-derived defaults with specific props
  return {
    ...props,
    // Some components might need specific keys that were in the old generic ChartLayout
    // We can map props.radius to specific keys if needed, or update components to be more generic
    // For now, our new components (OuterPlanetRing, etc) take specific config objects, which is great.
    // The older ones (ZodiacWheel) take a Layout object. We might need to mock it.
  };
}

// Mock Layout for legacy components that expect a full ChartLayout
// We construct it dynamically from the props provided in the config
function createLegacyLayout(ctx: RenderContext, props: any) {
    return {
        radius: ctx.radius,
        // Zodiac
        zodiacOuter: props.outerRadius ?? ctx.radius,
        zodiacInner: props.innerRadius ?? (ctx.radius - 40),
        zodiacSymbol: props.symbolRadius ?? (ctx.radius - 20),
        // Degree
        degreeRing: props.degreeRadius ?? (ctx.radius - 40),
        degreeTickSmall: props.tickSmall ?? 3,
        degreeTickMedium: props.tickMedium ?? 5,
        degreeTickLarge: props.tickLarge ?? 8,
        // House
        houseRing: props.radius ?? (ctx.radius * 0.5),
        houseText: props.textRadius ?? (ctx.radius * 0.45),
        angleLabelRadius: props.labelRadius ?? (ctx.radius * 0.45),
        // Aspect
        aspectBoundary: props.radius ?? (ctx.radius * 0.4),
        // Dummy values for others
        planetSymbol: 0, planetDegree: 0, planetTickStart: 0, planetTickLength: 0,
    } as any;
}


// --- Adapters ---

// 1. Background Circle
registerComponent('circle', (ctx, config) => {
  const r = config.props?.radius ?? ctx.radius;
  return `<circle cx="${ctx.cx}" cy="${ctx.cy}" r="${r}" 
            fill="${config.props?.fill ?? 'none'}" 
            stroke="${config.props?.stroke ?? 'none'}" 
            stroke-opacity="${config.props?.strokeOpacity ?? 1}" />`;
});

// 2. Zodiac Wheel
registerComponent('zodiacWheel', (ctx, config) => {
  const layout = createLegacyLayout(ctx, config.props);
  return drawZodiacWheel(ctx.cx, ctx.cy, ctx.rotationOffset, layout);
});

// 3. Degree Rings
registerComponent('degreeRings', (ctx, config) => {
    const layout = createLegacyLayout(ctx, config.props);
    return drawDegreeRings(ctx.cx, ctx.cy, ctx.rotationOffset, layout);
});

// 4. House Lines
registerComponent('houseLines', (ctx, config) => {
    const dataSource = config.dataSource === 'secondary' && ctx.secondary ? ctx.secondary : ctx.primary;
    const layout = createLegacyLayout(ctx, config.props);
    
    // Allow overriding start/end radius specifically for simple HouseLines usage
    const options = {
        startRadius: config.props?.startRadius,
        endRadius: config.props?.endRadius,
        showLabels: config.props?.showLabels,
        labelRadius: config.props?.labelRadius
    };

    return drawHouseLines(ctx.cx, ctx.cy, dataSource.houses, ctx.rotationOffset, layout, options);
});

// 5. Outer Planet Ring (Transit Style)
registerComponent('outerPlanetRing', (ctx, config) => {
    const dataSource = config.dataSource === 'secondary' && ctx.secondary ? ctx.secondary : ctx.primary;
    
    const layout: OuterRingLayout = {
        symbolRadius: config.props?.symbolRadius ?? ctx.radius,
        tickStartRadius: config.props?.tickStartRadius ?? (ctx.radius - 20),
        tickLength: config.props?.tickLength ?? 10,
        degreeRadius: config.props?.degreeRadius ?? ctx.radius
    };

    return drawOuterPlanetRing(ctx.cx, ctx.cy, dataSource.bodies, ctx.rotationOffset, layout);
});

import { drawPlanetGlyphs } from '../components/PlanetGlyphs.js';

// ... (existing code)

// 6. Stacked Planet Ring (Synastry/Natal Style)
registerComponent('stackedPlanetRing', (ctx, config) => {
    const dataSource = config.dataSource === 'secondary' && ctx.secondary ? ctx.secondary : ctx.primary;
    
    const layout: StackedRingLayout = {
        symbolStartRadius: config.props?.symbolRadius ?? ctx.radius,
        orbitStep: config.props?.orbitStep ?? 18,
        tickStartRadius: config.props?.tickStartRadius ?? ctx.radius,
        tickLength: config.props?.tickLength ?? 10
    };

    return drawStackedPlanetRing(ctx.cx, ctx.cy, dataSource.bodies, ctx.rotationOffset, layout);
});

// 6b. Standard Planet Ring (Natal Style)
registerComponent('planetRing', (ctx, config) => {
    const dataSource = config.dataSource === 'secondary' && ctx.secondary ? ctx.secondary : ctx.primary;
    const layout = createLegacyLayout(ctx, config.props);
    
    // Merge specific planet props if they exist in config.props
    const planetLayout = {
        ...layout,
        planetSymbol: config.props?.symbolRadius ?? layout.planetSymbol,
        planetDegree: config.props?.degreeRadius ?? layout.planetDegree,
        planetTickStart: config.props?.tickStartRadius ?? layout.planetTickStart,
        planetTickLength: config.props?.tickLength ?? layout.planetTickLength,
    };

    return drawPlanetGlyphs(
        ctx.cx, ctx.cy, 
        dataSource.bodies, 
        ctx.primary.houses, // Always use primary houses for collision context
        ctx.rotationOffset, 
        planetLayout, 
        config.props?.markerRenderer
    );
});

// 7. Aspect Lines
registerComponent('aspectLines', (ctx, config) => {
    // Determine which bodies to aspect
    let aspects;
    const MAIN_PLANETS = [
        BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
        BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto
    ];

    if (config.dataSource === 'combined' && ctx.secondary) {
        // Synastry / Transit Aspects
        const bodiesA = ctx.primary.bodies.filter(b => MAIN_PLANETS.includes(b.id));
        const bodiesB = ctx.secondary.bodies.filter(b => MAIN_PLANETS.includes(b.id));
        aspects = calculateDualAspects(bodiesA, bodiesB); // Or bodiesB, bodiesA depending on direction
    } else {
        // Natal Aspects (already calculated in data)
        aspects = ctx.primary.aspects;
    }

    const layout = createLegacyLayout(ctx, config.props);
    return drawAspectLines(ctx.cx, ctx.cy, aspects, ctx.rotationOffset, layout);
});
