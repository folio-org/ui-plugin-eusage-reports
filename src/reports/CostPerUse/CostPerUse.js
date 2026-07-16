import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, Button } from '@folio/stripes/components';
import downloadCSV from '../../util/downloadCSV';
import barValueLabels from '../../util/barValueLabels';


// The average number of times each item that was used at all got used: the
// total use count over the number of distinct items used. Both bars in a
// period are derived from that same pair of counts, so they share a caption.
//
// Returns undefined when the period has no usage to average, so the caller
// can fall back to the plain cost.
export function usesPerItemCaption(intl, cpu, index) {
  const total = (cpu.totalItemRequestsByPeriod || [])[index];
  const unique = (cpu.uniqueItemRequestsByPeriod || [])[index];
  if (!total || !unique) return undefined;

  return intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.usesPerItem' }, {
    // Rounded here rather than left to the message's number format, so that
    // the value the message pluralises on is the one it goes on to show: an
    // average of 1.004 must read "1 use", not "1 uses".
    average: Math.round((total / unique) * 100) / 100,
    total,
    unique,
  });
}


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
        inBarLabels: cpu.totalItemRequestsByPeriod,
        backgroundColor: 'blue',
        yAxisID: 'costPerUse',
      },
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.metric.Unique_Item_Requests' }),
        data: cpu.uniqueItemCostsPerRequestsByPeriod,
        inBarLabels: cpu.uniqueItemRequestsByPeriod,
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
        // Report only the element under the pointer. Chart.js would otherwise
        // be free to pull in the whole period, which would repeat the shared
        // use-count caption once per bar.
        mode: 'nearest',
        intersect: true,
        callbacks: {
          label: (item) => {
            const cost = `${item.dataset.label}: ${item.formattedValue}`;
            if (item.dataset.type === 'line') return cost;
            return usesPerItemCaption(intl, cpu, item.dataIndex) || cost;
          },
        },
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
      totalItemRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.number,
      ).isRequired,
      uniqueItemRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.number,
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
