import randomColor from 'randomcolor';


function vectorAdd(v1, v2) {
  return v1.map((value, index) => value + v2[index]);
}


function chooseColor(index, method) {
  // Default colors from https://github.com/chartjs/Chart.js/issues/815#issuecomment-270186793
  const colors = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];

  switch (method) {
    case 1:
      switch (index) {
        case 0: return 'blue';
        case 1: return 'red';
        case 2: return 'yellow';
        case 3: return 'green';
        default:
          return '#' + (index * 214013).toString(16).slice(-3);
      }

    case 2:
      return colors[index % colors.length];

    default:
      // By observation, consecutive colors are too close
      // together. Multiplying by a big number spaces the colors out
      // more, so there is more contrast between adjacent bars.
      return randomColor({ seed: index * 12368 });
  }
}


// We want three columns, for the three unique periodOfUse values 2019, 2020 and 2021.
// Each column needs 10 stacked elements for the ten publication years.
// So `datasets` must be an array of 10 sets, each of three elements.

function transformReqByPubYearData(rbpy, metricType) {
  if (!rbpy) return null;
  const periodOfUseRegister = {};
  rbpy.items.forEach(item => {
    periodOfUseRegister[item.periodOfUse] = true;
  });

  const periodOfUseList = Object.keys(periodOfUseRegister).sort();

  const dataForPeriod = {};
  rbpy.items.forEach(item => {
    if (item.metricType === metricType) {
      // if (item.accessType === 'OA_Gold') item.accessCountsByPeriod[0] = 123; // XXX no
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
      label: index === 0 ? `Published ${publicationYear}` : publicationYear,
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


export default transformReqByPubYearData;
