import randomColor from 'randomcolor';

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

export default chooseColor;
