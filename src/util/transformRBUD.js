import vectorAdd from './vectorAdd';
import chooseColor from './chooseColor';


// We want three columns, for the three unique periodOfUse values 2019, 2020 and 2021.
// Each column needs 10 stacked elements for the ten publication years.
// So `datasets` must be an array of 10 sets, each of three elements.

function transformReqByUseDateData(rbpy, metricType) {
  if (!rbpy) return null;
  const periodOfUseRegister = {};
  rbpy.items.forEach(item => {
    periodOfUseRegister[item.periodOfUse] = true;
  });

  const periodOfUseList = Object.keys(periodOfUseRegister).sort();

  const dataForPeriod = {};
  rbpy.items.forEach(item => {
    if (item.metricType === metricType) {
      if (!dataForPeriod[item.periodOfUse]) {
        dataForPeriod[item.periodOfUse] = item.accessCountsByPeriod;
      } else {
        dataForPeriod[item.periodOfUse] = vectorAdd(dataForPeriod[item.periodOfUse], item.accessCountsByPeriod);
      }
    }
  });

  const dataForPeriodList = Object.keys(dataForPeriod).sort().map(periodOfUse => dataForPeriod[periodOfUse]);

  const datasets = rbpy.accessCountPeriods.map((publicationYear, index) => {
    return {
      label: publicationYear,
      data: dataForPeriodList.map(countByPublicationYear => countByPublicationYear[index]),
      backgroundColor: chooseColor(index),
      stack: 'Stack 0',
    };
  });

  return {
    labels: periodOfUseList,
    datasets,
  };
}


export default transformReqByUseDateData;
