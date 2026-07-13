import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, MultiColumnList, NoValue, Button, Accordion } from '@folio/stripes/components';
import downloadCSV from '../../util/downloadCSV';


function renderUseOverTimeTable(uot) {
  const dates = uot.accessCountPeriods;

  const tirByDate = {};
  dates.forEach((date, i) => {
    tirByDate[date] = uot.totalItemRequestsByPeriod[i];
  });

  const uirByDate = {};
  dates.forEach((date, i) => {
    uirByDate[date] = uot.uniqueItemRequestsByPeriod[i];
  });

  const pointlessFormattersForDateColumns = {};
  dates.forEach(date => {
    // We need these because MCL throws a hissy-fit if it sees an undefined value
    pointlessFormattersForDateColumns[date] = (x) => x[date] || '';
  });

  const dataLines = uot.items.map(item => {
    const rec = {
      title: item.title,
      accessType: item.accessType ?
        <FormattedMessage id={`ui-plugin-eusage-reports.useOverTime.access.${item.accessType}`} /> :
        <NoValue />,
      metricType: item.metricType ?
        <FormattedMessage id={`ui-plugin-eusage-reports.useOverTime.metric.${item.metricType}`} /> :
        <NoValue />,
    };

    dates.forEach((date, i) => {
      rec[date] = item.accessCountsByPeriod[i];
    });

    return rec;
  });

  const dataSet = [
    {
      title: <b><FormattedMessage id="ui-plugin-eusage-reports.useOverTime.totalItemRequests" /></b>,
      accessType: undefined,
      metricType: undefined,
      ...tirByDate,
    },
    {
      title: <b><FormattedMessage id="ui-plugin-eusage-reports.useOverTime.uniqueItemRequests" /></b>,
      accessType: undefined,
      metricType: undefined,
      ...uirByDate,
    },
    ...dataLines,
  ];

  return (
    <>
      <p>
        <b><FormattedMessage id="ui-plugin-eusage-reports.useOverTime.totalTotalItemRequests" /></b>
        {': '}
        {uot.totalItemRequestsTotal}
      </p>
      <p>
        <b><FormattedMessage id="ui-plugin-eusage-reports.useOverTime.totalUniqueItemRequests" /></b>
        {': '}
        {uot.uniqueItemRequestsTotal}
      </p>

      <MultiColumnList
        contentData={dataSet}
        visibleColumns={['title', 'accessType', 'metricType', ...dates]}
        columnMapping={{
          title: <FormattedMessage id="ui-plugin-eusage-reports.useOverTime.column.title" />,
          accessType: <FormattedMessage id="ui-plugin-eusage-reports.useOverTime.column.accessType" />,
          metricType: <FormattedMessage id="ui-plugin-eusage-reports.useOverTime.column.metricType" />,
        }}
        columnWidths={{
          title: '150px',
          accessType: '150px',
          metricType: '150px',
        }}
        formatter={{
          ...pointlessFormattersForDateColumns,
        }}
      />
    </>
  );
}


// The metric (count) types that Use-over-time can display, in the order
// they should appear in the "Overview (all)" chart and in the picker.
export const UOT_METRIC_TYPES = [
  'Total_Item_Requests',
  'Unique_Item_Requests',
  'Unique_Title_Requests',
  'Searches_Regular',
  'Total_Item_Investigations',
  'Unique_Item_Investigations',
  'Unique_Title_Investigations',
];

// A stable colour per metric type, so a given series keeps its colour
// whether it is shown on its own or alongside the others in "Overview".
const METRIC_COLORS = {
  Total_Item_Requests: 'blue',
  Unique_Item_Requests: 'red',
  Unique_Title_Requests: '#FF9900',
  Searches_Regular: '#109618',
  Total_Item_Investigations: '#990099',
  Unique_Item_Investigations: '#0099C6',
  Unique_Title_Investigations: '#DD4477',
};


// Return the by-period access counts for a single metric type, or null if
// the report contains no data for that metric type (so it can be skipped).
//
// The two long-standing metric types have pre-computed totals at the top
// level of the report; the rest are aggregated on the fly from the
// per-title `items`, summing every item that carries the given metricType.
export function seriesForMetricType(uot, metricType) {
  if (metricType === 'Total_Item_Requests') return uot.totalItemRequestsByPeriod;
  if (metricType === 'Unique_Item_Requests') return uot.uniqueItemRequestsByPeriod;

  const totals = (uot.accessCountPeriods || []).map(() => 0);
  let seen = false;
  (uot.items || []).forEach(item => {
    if (item.metricType === metricType) {
      seen = true;
      (item.accessCountsByPeriod || []).forEach((n, i) => { totals[i] += (n || 0); });
    }
  });

  return seen ? totals : null;
}


// Chart.js plugin that draws each bar's value just above the top of the bar.
export const barValueLabels = {
  id: 'barValueLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;
      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        if (value === null || value === undefined) return;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '12px sans-serif';
        ctx.fillText(value, element.x, element.y - 2);
        ctx.restore();
      });
    });
  },
};


function renderUseOverTimeChart(intl, uot, xCaption, yCaption, countType) {
  // "overview" shows every metric type; any other value shows just that one.
  const selectedTypes = (!countType || countType === 'overview') ?
    UOT_METRIC_TYPES :
    [countType];

  const datasets = selectedTypes
    .map(metricType => ({ metricType, values: seriesForMetricType(uot, metricType) }))
    .filter(d => d.values) // drop metric types absent from this report
    .map(d => ({
      label: intl.formatMessage({ id: `ui-plugin-eusage-reports.useOverTime.metric.${d.metricType}` }),
      data: d.values,
      backgroundColor: METRIC_COLORS[d.metricType],
    }));

  const data = {
    labels: uot.accessCountPeriods,
    datasets,
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: xCaption,
        },
      },
      y: {
        title: {
          display: true,
          text: yCaption,
        },
        beginAtZero: true,
        // Leave headroom above the tallest bar so its value label is never
        // clipped at the top of the chart.
        grace: '8%',
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    animation: false,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ resize: 'vertical', overflow: 'scroll' }}>
      <Bar
        redraw
        data={data}
        height={400}
        options={options}
        plugins={[barValueLabels]}
      />
    </div>
  );
}


function UseOverTime({ url, params, hasLoaded, data, xCaption, yCaption }) {
  const intl = useIntl();
  const stripes = useStripes();
  if (!hasLoaded) return <><br /><Loading /><br /></>;
  const uot = data.useOverTime;

  return (
    <>
      {renderUseOverTimeChart(intl, uot, xCaption, yCaption, params.countType)}
      <div style={{ textAlign: 'right', marginTop: '1em' }}>
        <Button buttonStyle="primary" onClick={() => downloadCSV(url, stripes, params)}>
          <FormattedMessage id="ui-plugin-eusage-reports.button.download-csv" />
        </Button>
      </div>
      {stripes.config.showDevInfo &&
        <Accordion closedByDefault label={<FormattedMessage id="ui-plugin-eusage-reports.useOverTime.table" />}>
          {renderUseOverTimeTable(uot)}
        </Accordion>
      }
    </>
  );
}


UseOverTime.propTypes = {
  url: PropTypes.string,
  hasLoaded: PropTypes.bool.isRequired,
  params: PropTypes.shape({
    format: PropTypes.string.isRequired, // j=journal, b=book, etc.
    includeOA: PropTypes.bool.isRequired,
    startDate: PropTypes.string.isRequired, // ISO-format date
    endDate: PropTypes.string.isRequired, // ISO-format date
    countType: PropTypes.string, // 'overview' or a specific metric type
  }).isRequired,
  data: PropTypes.shape({
    useOverTime: PropTypes.shape({
      totalItemRequestsTotal: PropTypes.number,
      uniqueItemRequestsTotal: PropTypes.number,
      accessCountPeriods: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
      totalItemRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.number,
      ).isRequired,
      uniqueItemRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.number,
      ).isRequired,
    }),
  }),
  xCaption: PropTypes.string.isRequired,
  yCaption: PropTypes.string.isRequired,
};


export default UseOverTime;
