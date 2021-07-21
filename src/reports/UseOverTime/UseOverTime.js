import PropTypes from 'prop-types';
import { Loading, MultiColumnList, Accordion } from '@folio/stripes/components';


function UseOverTime({ data }) {
  const uot = data.useOverTime;
  if (!uot) return <><br /><Loading /><br /></>;

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

  const dataSet = [
    {
      title: <b>{"Totals - Total item requests"}</b>,
      accessType: undefined,
      metricType: undefined,
      ...tirByDate,
    },
    {
      title: <b>{"Totals - Unique item requests"}</b>,
      accessType: undefined,
      metricType: undefined,
      ...uirByDate,
    },
  ];

  return (
    <>
      <MultiColumnList
        contentData={dataSet}
        visibleColumns={['title', 'accessType', 'metricType', ...dates]}
        columnMapping={{
          title: "Title",
          accessType: "Access type",
          metricType: "Metric type",
        }}
        columnWidths={{
          title: '150px',
          accessType: '100px',
          metricType: '100px',
        }}
        formatter={{
          ...pointlessFormattersForDateColumns,
        }}
      />

      <Accordion closedByDefault label="use-over-time data">
        <pre>
          {JSON.stringify(uot, null, 2)}
        </pre>
      </Accordion>
    </>
  );
}


UseOverTime.propTypes = {
  data: PropTypes.shape({
    useOverTime: PropTypes.shape({
      accessCountPeriods: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
      totalItemRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
      uniqueItemRequestsByPeriod: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
    }).isRequired,
  }),
};


export default UseOverTime;
