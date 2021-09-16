import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, Button } from '@folio/stripes/components';
import downloadCSV from '../../util/downloadCSV';


function CostPerUse({ url, params, hasLoaded, data }) {
  const intl = useIntl();
  const stripes = useStripes();
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
    maintainAspectRatio: false,
  };

  return (
    <>
      <div style={{ resize: 'vertical', overflow: 'scroll' }}>
        <Bar
          redraw
          data={graphData}
          height={400}
          options={options}
        />
      </div>
      <div style={{ textAlign: 'right', marginTop: '1em' }}>
        <Button buttonStyle="primary" onClick={() => downloadCSV(url, stripes, params)}>
          <FormattedMessage id="ui-plugin-eusage-reports.button.download-csv" />
        </Button>
      </div>
    </>
  );
}


CostPerUse.propTypes = {
  url: PropTypes.string,
  hasLoaded: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
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
