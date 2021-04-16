import pkg from 'lodash';

// We use this roundabout way of importing because standalone Node needs it
const { camelCase } = pkg;



function array2object(row, fieldNames) {
  const obj = {};

  for (let j = 0; j < row.length; j++) {
    const fieldName = fieldNames[j] || 'ADDITIONAL';
    obj[fieldName] = row[j];
  }

  return obj;
}


function compileCostPerUseData(csv) {
  const fieldNames = csv[0].map(camelCase);

  // First, transform tabular data into a set of records
  const entries = [];
  for (let i = 1; i < csv.length; i++) {
    const row = csv[i];
    if (row[0] === '') break; // Stop on first row with blank 1st column

    const obj = array2object(row, fieldNames);
    entries.push(obj);
  }

  // Gather all reporting years
  // (Some agreement lines may be reported for years when others are not.)
  const reportingYears = {};
  for (let i = 0; i < entries.length; i++) {
    const obj = entries[i];
    reportingYears[obj.reportingYear] = true;
  }

  const sortedReportingYears = Object.keys(reportingYears).sort();

  // Accumulate data for each individual agreement line
  const agreementLines = {};
  for (let i = 0; i < entries.length; i++) {
    const obj = entries[i];
    const name = obj.agreementLine;
    const date = obj.reportingYear;
    if (!agreementLines[name]) agreementLines[name] = {};
    agreementLines[name][date] = obj;
  }

  const res = {};
  Object.keys(agreementLines).sort().forEach(key => {
    res[key] = {
      labels: sortedReportingYears,
      total: [],
      unique: [],
    };

    const al = agreementLines[key];
    sortedReportingYears.forEach(ry => {
      const obj = al[ry] || { costPerRequestTotal: 0, costPerRequestUnique: 0 };
      res[key].total.push(obj.costPerRequestTotal);
      res[key].unique.push(obj.costPerRequestUnique);
    });
  });

  // Now, the data accumulated across all agreement lines
  const acc = {
    labels: sortedReportingYears,
    total: [],
    unique: [],
  };

  sortedReportingYears.forEach(ry => {
    let total = 0;
    let unique = 0;

    Object.keys(agreementLines).sort().forEach(key => {
      const obj = agreementLines[key][ry] || { costPerRequestTotal: 0, costPerRequestUnique: 0 };
      total += Number(obj.costPerRequestTotal);
      unique += Number(obj.costPerRequestUnique);
    });

    acc.total.push(total);
    acc.unique.push(unique);
  });

  res[''] = acc;

  return res;
}


export default compileCostPerUseData;
