import { registerComponent, RenderContext, ComponentConfig } from './engine.js';
import { drawZodiacWheel, ZodiacWheelConfig } from '../components/ZodiacWheel.js';
import { drawDegreeRings, DegreeRingsConfig } from '../components/DegreeRings.js';
import { drawHouseLines, HouseLinesConfig } from '../components/HouseLines.js';
import { drawOuterPlanetRing, OuterRingLayout } from '../components/OuterPlanetRing.js';
import { drawStackedPlanetRing, StackedRingLayout } from '../components/StackedPlanetRing.js';
import { drawAspectLines, AspectLinesConfig } from '../components/AspectLines.js';
import { drawPlanetGlyphs, PlanetGlyphsConfig } from '../components/PlanetGlyphs.js';
import { calculateDualAspects } from '../../core/aspects.js';
import { ChartData, BodyId } from '../../core/types.js';

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
  const c: ZodiacWheelConfig = {
      outerRadius: config.props?.outerRadius ?? ctx.radius,
      innerRadius: config.props?.innerRadius ?? (ctx.radius - 40),
      symbolRadius: config.props?.symbolRadius ?? (ctx.radius - 20)
  };
  return drawZodiacWheel(ctx.cx, ctx.cy, ctx.rotationOffset, c);
});

// 3. Degree Rings
registerComponent('degreeRings', (ctx, config) => {
    const c: DegreeRingsConfig = {
        degreeRadius: config.props?.degreeRadius ?? (ctx.radius - 40),
        tickSmall: config.props?.tickSmall ?? 3,
        tickMedium: config.props?.tickMedium ?? 5,
        tickLarge: config.props?.tickLarge ?? 8
    };
    return drawDegreeRings(ctx.cx, ctx.cy, ctx.rotationOffset, c);
});

// 4. House Lines
registerComponent('houseLines', (ctx, config) => {
    const dataSource = config.dataSource === 'secondary' && ctx.secondary ? ctx.secondary : ctx.primary;
    
    // Default logic: lines go from 'radius' to 'endRadius'.
    // If only 'radius' is given (typical for Natal), endRadius defaults to something logical (Zodiac Inner).
    // But since we are declarative now, we prefer explicit props or defaults relative to ctx.
    
    const radius = config.props?.radius ?? (ctx.radius * 0.5); // Inner ring
    
    const c: HouseLinesConfig = {
        radius: config.props?.startRadius ?? radius,
        endRadius: config.props?.endRadius ?? (ctx.radius - 40), // Default to Zodiac Inner
        showLabels: config.props?.showLabels,
        labelRadius: config.props?.labelRadius,
        angleLabelRadius: config.props?.angleLabelRadius ?? (ctx.radius * 0.45)
    };

    return drawHouseLines(ctx.cx, ctx.cy, dataSource.houses, ctx.rotationOffset, c);
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
    
    const c: PlanetGlyphsConfig = {
        planetSymbol: config.props?.symbolRadius ?? (ctx.radius - 75),
        planetDegree: config.props?.degreeRadius ?? (ctx.radius - 95),
        planetTickStart: config.props?.tickStartRadius ?? (ctx.radius - 45),
        planetTickLength: config.props?.tickLength ?? 10
    };

    return drawPlanetGlyphs(
        ctx.cx, ctx.cy, 
        dataSource.bodies, 
        ctx.primary.houses, // Always use primary houses for collision context
        ctx.rotationOffset, 
        c, 
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
        aspects = calculateDualAspects(bodiesA, bodiesB); 
    } else {
        // Natal Aspects
        aspects = ctx.primary.aspects;
    }

    const c: AspectLinesConfig = {
        radius: config.props?.radius ?? (ctx.radius * 0.4)
    };
    return drawAspectLines(ctx.cx, ctx.cy, aspects, ctx.rotationOffset, c);
});