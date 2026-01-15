import { ChartData, BodyId } from './core/types.js';
import { calculateDistribution } from './analysis/distribution.js';

export function generateTextReport(chart: ChartData): string {
  const lines: string[] = [];

  const title = `AstroCore Report - ${chart.meta.date}`;
  lines.push(title);
  lines.push('='.repeat(title.length));
  lines.push('');

  // 1. Meta / Settings
  lines.push('--- Settings ---');
  lines.push(`Location:  Lat ${chart.meta.location.latitude}, Lng ${chart.meta.location.longitude}`);
  lines.push(`House Sys: ${chart.meta.houseSystem}`);
  lines.push(`Zodiac:    ${chart.meta.zodiacType}`);
  if (chart.meta.siderealMode !== undefined) lines.push(`Sidereal:  ${chart.meta.siderealMode}`);
  lines.push(`Perspect.: ${chart.meta.perspective}`);
  lines.push('');

  // 2. Celestial Points
  lines.push('--- Celestial Points ---');
  lines.push('Point'.padEnd(15) + 'Sign'.padEnd(15) + 'Pos.'.padEnd(10) + 'House'.padEnd(8) + 'Retro.');
  lines.push('-'.repeat(55));
  
  for (const body of chart.bodies) {
    const row = body.name.replace('_', ' ').padEnd(15) + 
                `${body.sign} ${body.emoji}`.padEnd(15) + 
                `${body.degree.toFixed(2)}°`.padEnd(10) + 
                body.house.toString().padEnd(8) + 
                (body.isRetrograde ? 'R' : '-');
    lines.push(row);
  }
  lines.push('');

  // 3. Houses
  lines.push('--- Houses ---');
  for (const house of chart.houses) {
    lines.push(`House ${house.house.toString().padStart(2)}: ${house.sign.padEnd(12)} ${house.degree.toFixed(2)}°`);
  }
  lines.push('');

  // 4. Lunar Phase
  lines.push('--- Lunar Phase ---');
  lines.push(`Phase: ${chart.lunarPhase.phaseName}`);
  lines.push(`Illum: ${(chart.lunarPhase.illumination * 100).toFixed(1)}%`);
  lines.push('');

  // 5. Distribution
  const dist = calculateDistribution(chart.bodies, chart.angles);
  lines.push('--- Elements ---');
  for (const [k, v] of Object.entries(dist.elements)) {
    lines.push(`${k.padEnd(10)}: ${v.toFixed(1)}`);
  }
  lines.push('');
  lines.push('--- Qualities ---');
  for (const [k, v] of Object.entries(dist.qualities)) {
    lines.push(`${k.padEnd(10)}: ${v.toFixed(1)}`);
  }

  return lines.join('\n');
}