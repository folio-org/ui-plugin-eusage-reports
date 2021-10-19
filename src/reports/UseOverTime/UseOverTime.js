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


function renderUseOverTimeChart(intl, uot, xCaption, yCaption) {
  const data = {
    labels: uot.accessCountPeriods,
    datasets: [
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.useOverTime.metric.Total_Item_Requests' }),
        data: uot.totalItemRequestsByPeriod,
        backgroundColor: 'blue',
      },
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.useOverTime.metric.Unique_Item_Requests' }),
        data: uot.uniqueItemRequestsByPeriod,
        backgroundColor: 'red',
      },
    ],
  };

  const options = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: xCaption,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: yCaption,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
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
      {renderUseOverTimeChart(intl, uot, xCaption, yCaption)}
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
