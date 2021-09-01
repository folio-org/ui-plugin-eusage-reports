import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { Loading } from '@folio/stripes/components';


function CostPerUse({ hasLoaded, data }) {
  const intl = useIntl();
  if (!hasLoaded) return <><br /><Loading /><br /></>;
  const cpu = data.costPerUse;

  const graphData = {
    labels: cpu.accessCountPeriods,
    datasets: [
      {
        type: 'line',
        fill: 'false',
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.titleCount' }),
        data: cpu.titleCountByPeriod,
        backgroundColor: 'gold', // for the legend
        borderColor: 'gold',
        borderWidth: 2,
        lineTension: 0,
        yAxisID: 'titleCount',
      },
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.metric.Total_Item_Requests' }),
        data: cpu.totalItemCostsPerRequestsByPeriod,
        backgroundColor: 'blue',
        yAxisID: 'costPerUse',
      },
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.metric.Unique_Item_Requests' }),
        data: cpu.uniqueItemCostsPerRequestsByPeriod,
        backgroundColor: 'red',
        yAxisID: 'costPerUse',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          id: 'costPerUse',
          ticks: {
            beginAtZero: true,
          },
        },
        {
          id: 'titleCount',
          position: 'right',
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    animation: false,
  };

  return (
    <Bar
      redraw
      data={graphData}
      options={options}
    />
  );
}


CostPerUse.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    costPerUse: PropTypes.shape({
      accessCountPeriods: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
      totalItemCostsPerRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.number,
      ).isRequired,
      uniqueItemCostsPerRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.number,
      ).isRequired,
      titleCountByPeriod: PropTypes.arrayOf(
        PropTypes.number,
      ).isRequired,
    }),
  }),
};


export default CostPerUse;
