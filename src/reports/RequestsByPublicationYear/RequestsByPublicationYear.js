import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, Accordion } from '@folio/stripes/components';
import transformReqByPubYearData from '../../util/transformRBPY';


function renderRequestsByPublicationYearChart(intl, rbpy) {
  const data = transformReqByPubYearData(rbpy, 'Controlled', 'Unique_Item_Requests');

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
    stacked: true,
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
