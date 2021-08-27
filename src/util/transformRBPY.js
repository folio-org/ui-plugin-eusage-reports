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
      return randomColor({ seed: 123 + index * 12368 });
  }
}


// We want ten columns, for the ten accessCountsByPeriod values
// (really publication years, delivered in a field with a misleading
// name), 2010-2019.
// Each column needs three stacked elements for the three periods of use.
// So `datasets` must be an array of three sets, each of 10 elements.

function transformReqByPubYearData(rbpy, metricType) {
  if (!rbpy) return null;

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

  const datasets = Object.keys(dataForPeriod).sort().map((periodOfUse, index) => ({
    label: periodOfUse,
    data: dataForPeriod[periodOfUse],
    backgroundColor: chooseColor(index),
    stack: 'Stack 0',
  }));

  return {
    labels: Object.keys(dataForPeriod).sort(),
    datasets,
  };
}


export default transformReqByPubYearData;
