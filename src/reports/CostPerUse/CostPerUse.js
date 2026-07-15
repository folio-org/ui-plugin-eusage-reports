import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, Button } from '@folio/stripes/components';
import downloadCSV from '../../util/downloadCSV';
import barValueLabels from '../../util/barValueLabels';


function CostPerUse({ url, params, hasLoaded, data, xCaption, yCaption }) {
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
      x: {
        title: {
          display: true,
          text: xCaption,
        },
      },
      costPerUse: {
        title: {
          display: true,
          text: yCaption,
        },
        beginAtZero: true,
        grace: '8%',
      },
      titleCount: {
        position: 'right',
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        // The bar series now show their values above each bar, so their
        // tooltips are redundant. The title-count line has no such labels,
        // so keep its tooltip as the only way to read its values.
        filter: (item) => item.dataset.type === 'line',
      },
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
          plugins={[barValueLabels]}
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
  xCaption: PropTypes.string.isRequired,
  yCaption: PropTypes.string.isRequired,
};


export default CostPerUse;
