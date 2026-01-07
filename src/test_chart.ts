import { calculateChart } from './calculator.js';
import { renderChart } from './visuals/renderer.js';
import * as fs from 'fs';

const birthData = {
  date: '1988-06-18T09:00:00Z',
  location: {
    latitude: 33.0,
    longitude: 120.0
  }
};

const chart = calculateChart(birthData);
const svg = renderChart(chart);

fs.writeFileSync('chart.svg', svg);
console.log('Birth chart SVG generated: chart.svg');
