import { camelCase } from 'lodash';


function array2object(row, fieldNames) {
  const obj = {};

  for (let j = 0; j < row.length; j++) {
    const fieldName = fieldNames[j] || 'ADDITIONAL';
    obj[fieldName] = row[j];
  }

  return obj;
}


function compileCostPerUseData(raw) {
  const rawFieldNames = raw[0];
  const cookedFieldNames = rawFieldNames.map(camelCase);

  cookedFieldNames.push(1);

  const cooked = [];
  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    if (row[0] === '') break;
    const obj = array2object(row, cookedFieldNames);
    if (obj.agreementLine.startsWith('Agreement line B')) {
      cooked.push(obj);
    } else {
      // XXX We need to better understand the requirement here
    }
  }

  cooked.sort((a, b) => (
    a.reportingYear < b.reportingYear ? -1 :
      a.reportingYear > b.reportingYear ? 1 :
        0));

  return {
    total: cooked.map(o => o.costPerRequestTotal),
    unique: cooked.map(o => o.costPerRequestUnique),
    labels: cooked.map(o => o.reportingYear),
    DEBUG: cooked,
  };
}


export default compileCostPerUseData;
