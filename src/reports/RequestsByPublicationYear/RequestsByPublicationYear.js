import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, Accordion } from '@folio/stripes/components';


function renderRequestsByPublicationYearChart(intl, rbpy) {
  const data = {
    // XXX These data-sets are obviously completely wrong
    labels: rbpy.accessCountPeriods,
    datasets: [
      {
        label: 'Published 2019',
        data: rbpy.totalItemRequestsByPeriod,
        backgroundColor: 'green',
        stack: 'Stack 0',
      },
      {
        label: 'Published 2020',
        data: rbpy.uniqueItemRequestsByPeriod,
        backgroundColor: 'gold',
        stack: 'Stack 0',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      },
    },
    animation: false,
  };

  return (
    <Bar
      redraw
      data={data}
      options={options}
    />
  );
}


function RequestsByPublicationYear({ hasLoaded, data }) {
  const intl = useIntl();
  const stripes = useStripes();
  if (!hasLoaded) return <><br /><Loading /><br /></>;
  const rbpy = data.requestsByPublicationYear;

  return (
    <>
      {renderRequestsByPublicationYearChart(intl, rbpy)}
      {stripes.config.showDevInfo &&
        <Accordion closedByDefault label={<FormattedMessage id="ui-plugin-eusage-reports.useOverTime.raw-data" />}>
          <pre>{JSON.stringify(rbpy, null, 2)}</pre>
        </Accordion>
      }
    </>
  );
}


RequestsByPublicationYear.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    requestsByPublicationYear: PropTypes.shape({
      // XXX
    }),
  }),
};


export default RequestsByPublicationYear;
