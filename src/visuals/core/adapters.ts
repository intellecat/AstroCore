import { registerComponent, RenderContext, ComponentConfig } from './engine.js';
import { drawZodiacWheel, ZodiacWheelConfig } from '../components/ZodiacWheel.js';
import { drawDegreeRings, DegreeRingsConfig } from '../components/DegreeRings.js';
import { drawHouseLines, HouseLinesConfig } from '../components/HouseLines.js';
import { drawPlanetRing, PlanetRingConfig } from '../components/PlanetRing.js';
import { drawStackedPlanetRing, StackedRingLayout } from '../components/StackedPlanetRing.js';
import { drawAspectLines, AspectLinesConfig } from '../components/AspectLines.js';
import { calculateDualAspects } from '../../core/aspects.js';
import { ChartData, BodyId } from '../../core/types.js';

// --- Adapters ---

// Background Circle
registerComponent('circle', (ctx, config) => {
  const r = config.props?.radius ?? ctx.radius;
  return `<circle cx="${ctx.cx}" cy="${ctx.cy}" r="${r}" 
            fill="${config.props?.fill ?? 'none'}" 
            stroke="${config.props?.stroke ?? 'var(--astro-color-text)'}" 
            stroke-opacity="${config.props?.strokeOpacity ?? 0.1}" />`;
});

// Zodiac Wheel
registerComponent('zodiacWheel', (ctx, config) => {
  const c: ZodiacWheelConfig = {
      outerRadius: config.props?.outerRadius ?? ctx.radius,
      innerRadius: config.props?.innerRadius ?? (ctx.radius - 40),
      symbolRadius: config.props?.symbolRadius ?? (ctx.radius - 20),
      showSignBackgrounds: config.props?.showSignBackgrounds
  };
  return drawZodiacWheel(ctx.cx, ctx.cy, ctx.rotationOffset, c);
});

// Degree Rings
registerComponent('degreeRings', (ctx, config) => {
    const c: DegreeRingsConfig = {
        degreeRadius: config.props?.degreeRadius ?? (ctx.radius - 40),
        tickSmall: config.props?.tickSmall ?? 3,
        tickMedium: config.props?.tickMedium ?? 5,
        tickLarge: config.props?.tickLarge ?? 8
    };
    return drawDegreeRings(ctx.cx, ctx.cy, ctx.rotationOffset, c);
});

// House Lines
registerComponent('houseLines', (ctx, config) => {
    const dataSource = config.dataSource === 'secondary' && ctx.secondary ? ctx.secondary : ctx.primary;
    
    const radius = config.props?.radius ?? (ctx.radius * 0.5); 
    
    const c: HouseLinesConfig = {
        radius: config.props?.startRadius ?? radius,
        endRadius: config.props?.endRadius ?? (ctx.radius - 40),
        showLabels: config.props?.showLabels,
        labelRadius: config.props?.labelRadius,
        angleLabelRadius: config.props?.angleLabelRadius ?? (ctx.radius * 0.45)
    };

    return drawHouseLines(ctx.cx, ctx.cy, dataSource.houses, ctx.rotationOffset, c);
});

// Stacked Planet Ring (Synastry/Natal Style)
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

// Standard Planet Ring (Natal Style)
registerComponent('planetRing', (ctx, config) => {
    const dataSource = config.dataSource === 'secondary' && ctx.secondary ? ctx.secondary : ctx.primary;
    
    const c: PlanetRingConfig = {
        symbolRadius: config.props?.symbolRadius ?? (ctx.radius - 75),
        degreeRadius: config.props?.degreeRadius ?? (ctx.radius - 95),
        minuteRadius: config.props?.minuteRadius,
        zodiacSignRadius: config.props?.zodiacSignRadius,
        tickStartRadius: config.props?.tickStartRadius ?? (ctx.radius - 45),
        tickLength: config.props?.tickLength ?? 10,
        showMinutes: config.props?.showMinutes,
        showZodiacSign: config.props?.showZodiacSign
    };

    const avoidHouses = config.props?.avoidHouses ?? true;

    return drawPlanetRing(
        ctx.cx, ctx.cy, 
        dataSource.bodies, 
        ctx.rotationOffset, 
        c, 
        {
            houses: avoidHouses ? ctx.primary.houses : [], 
            markerRenderer: config.props?.markerRenderer
        }
    );
});

// Aspect Lines
registerComponent('aspectLines', (ctx, config) => {
    let aspects;
    const MAIN_PLANETS = [
        BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
        BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto
    ];

    if (config.dataSource === 'combined' && ctx.secondary) {
        const bodiesA = ctx.primary.bodies.filter(b => MAIN_PLANETS.includes(b.id));
        const bodiesB = ctx.secondary.bodies.filter(b => MAIN_PLANETS.includes(b.id));
        aspects = calculateDualAspects(bodiesA, bodiesB); 
    } else {
        aspects = ctx.primary.aspects;
    }

    const c: AspectLinesConfig = {
        radius: config.props?.radius ?? (ctx.radius * 0.4),
        showAspectSymbol: config.props?.showAspectSymbol
    };
    return drawAspectLines(ctx.cx, ctx.cy, aspects, ctx.rotationOffset, c);
});