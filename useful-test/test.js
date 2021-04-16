import compileCostPerUseData from '../src/reports/CostPerUse/compileCostPerUseData.js';

const csv = [
  ['Agreement line', 'Reporting year', 'Cost per request - total', 'Cost per request - unique'],
  ['Line A', '2017', '23.45', '25.22'],
  ['Line A', '2018', '28.02', '29.31'],
  ['Line B', '2018', '3.45', '8.92'],
  ['Line B', '2019', '3.76', '9.00'],
  ['Line C', '2017', '7.67', '11.42'],
];

console.log(compileCostPerUseData(csv));
