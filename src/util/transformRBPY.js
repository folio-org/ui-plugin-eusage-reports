import vectorAdd from './vectorAdd';
import chooseColor from './chooseColor';


// When we make a request with start- and end-dates 2019-2021, and get
// back data showing that papers published in 15 different years were
// used, we need fifteen columns (one per publication year), each with
// three colours (one per usage year). This means we need three data-sets
// of 15 points each.

function transformReqByPubYearData(rbpy, metricType) {
  if (!rbpy) return null;

  const periodOfUseRegister = {};
  rbpy.items.forEach(item => {
    if (item.metricType === metricType) {
      periodOfUseRegister[item.periodOfUse] = true;
    }
  });

  const periodsOfUse = Object.keys(periodOfUseRegister).sort();

  const periodOfUseIndex = {};
  periodsOfUse.forEach((period, i) => { periodOfUseIndex[period] = i; });

  const datasets = [];
  rbpy.items.forEach(item => {
    const pIndex = periodOfUseIndex[item.periodOfUse];
    if (!datasets[pIndex]) {
      datasets[pIndex] = {
        label: item.periodOfUse,
        data: item.accessCountsByPeriod,
        backgroundColor: chooseColor(pIndex),
        stack: 'Stack 0',
      };
    } else {
      datasets[pIndex].data = vectorAdd(datasets[pIndex].data, item.accessCountsByPeriod);
    }
  });

  return {
    labels: rbpy.accessCountPeriods,
    datasets,
  };
}


export default transformReqByPubYearData;
