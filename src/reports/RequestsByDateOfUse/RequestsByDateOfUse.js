import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, Button, Accordion } from '@folio/stripes/components';
import transformReqByUseDateData from '../../util/transformRBUD';
import downloadCSV from '../../util/downloadCSV';


function renderRequestsByDateOfUseChart(intl, data) {
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
    maintainAspectRatio: false,
  };

  return (
    <div style={{ resize: 'block', overflow: 'scroll' }}>
      <Bar
        redraw
        data={data}
        height={400}
        options={options}
      />
    </div>
  );
}


function RequestsByDateOfUse({ url, params, hasLoaded, data }) {
  const intl = useIntl();
  const stripes = useStripes();
  const rbpy = data.requestsByPublicationYear;
  const countType = params.countType === 'total' ? 'Total_Item_Requests' : 'Unique_Item_Requests';
  const transformed = useMemo(() => transformReqByUseDateData(rbpy, countType), [rbpy, countType]);
  if (!hasLoaded) return <><br /><Loading /><br /></>;

  return (
    <>
      {renderRequestsByDateOfUseChart(intl, transformed)}
      <div style={{ textAlign: 'right', marginTop: '1em' }}>
        <Button buttonStyle="primary" onClick={() => downloadCSV(url, stripes, params)}>
          <FormattedMessage id="ui-plugin-eusage-reports.button.download-csv" />
        </Button>
      </div>
      {stripes.config.showDevInfo &&
        <Accordion closedByDefault label={<FormattedMessage id="ui-plugin-eusage-reports.useOverTime.raw-data" />}>
          <pre>{JSON.stringify(rbpy, null, 2)}</pre>
        </Accordion>
      }
    </>
  );
}


RequestsByDateOfUse.propTypes = {
  url: PropTypes.string,
  params: PropTypes.shape({
    countType: PropTypes.string.isRequired,
  }).isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    requestsByPublicationYear: PropTypes.shape({
      // XXX
    }),
  }),
};


export default RequestsByDateOfUse;
