import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import { useStripes } from '@folio/stripes/core';
import { Loading, Button, Accordion } from '@folio/stripes/components';
import transformReqByPubYearData from '../../util/transformRBPY';
import downloadCSV from '../../util/downloadCSV';


function renderRequestsByPublicationYearChart(intl, data, xCaption, yCaption) {
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


function RequestsByPublicationYear({ url, params, hasLoaded, data, xCaption, yCaption }) {
  const intl = useIntl();
  const stripes = useStripes();
  const rbpy = data.requestsByPublicationYear;
  const countType = params.countType === 'total' ? 'Total_Item_Requests' : 'Unique_Item_Requests';

  // useMemo provokes several bizarre bugs: see UIPER-60 and
  // UIPER-61. Since this was arguably a premature optimization anyway
  // -- UI-side calculation is dwarfed by round-trip times -- the
  // simple solution is just not to optimise.
  //
  // const transformed = useMemo(() => transformReqByPubYearData(rbpy, countType), [rbpy, countType]);
  const transformed = transformReqByPubYearData(rbpy, countType);

  if (!hasLoaded) return <><br /><Loading /><br /></>;

  return (
    <>
      {renderRequestsByPublicationYearChart(intl, transformed, xCaption, yCaption)}
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


RequestsByPublicationYear.propTypes = {
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
  xCaption: PropTypes.string.isRequired,
  yCaption: PropTypes.string.isRequired,
};


export default RequestsByPublicationYear;
