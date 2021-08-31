import vectorAdd from './vectorAdd';
import chooseColor from './chooseColor';


// We want ten columns, for the ten accessCountsByPeriod values
// (really publication years, delivered in a field with a misleading
// name), 2010-2019.
// Each column needs three stacked elements for the three periods of use.
// So `datasets` must be an array of three sets, each of 10 elements.

function transformReqByPubYearData(rbpy, metricType) {
  if (!rbpy) return null;

  const dataForPeriod = {};
  const gotNonEmptyData = {};
  rbpy.items.forEach(item => {
    if (item.metricType === metricType) {
      if (item.accessCountsByPeriod.reduce((a, b) => a + b, 0)) {
        gotNonEmptyData[item.periodOfUse] = true;
      }
      if (!dataForPeriod[item.periodOfUse]) {
        console.log('registering periodOfUse', item.periodOfUse);
        dataForPeriod[item.periodOfUse] = item.accessCountsByPeriod;
      } else {
        dataForPeriod[item.periodOfUse] = vectorAdd(dataForPeriod[item.periodOfUse], item.accessCountsByPeriod);
      }
    }
  });
  console.log(' got periods of use', Object.keys(dataForPeriod).sort());

  const datasets = Object.keys(gotNonEmptyData).sort().map((periodOfUse, index) => ({
    label: periodOfUse,
    data: dataForPeriod[periodOfUse],
    backgroundColor: chooseColor(index),
    stack: 'Stack 0',
  }));

  const res = {
    labels: Object.keys(dataForPeriod).sort(),
    datasets,
  };
  console.log(res);
  return res;
}


export default transformReqByPubYearData;
