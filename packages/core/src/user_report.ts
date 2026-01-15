import { calculateChart } from './calculator.js';
import { generateTextReport } from './report.js';

const birthData = {
  date: '1988-06-18T09:00:00Z',
  location: {
    latitude: 33.0,
    longitude: 120.0
  }
};

const chart = calculateChart(birthData);
const report = generateTextReport(chart);

console.log(report);
