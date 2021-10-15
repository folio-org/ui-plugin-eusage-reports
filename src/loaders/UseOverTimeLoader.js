import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import UseOverTime from '../reports/UseOverTime';


function UseOverTimeLoader({ params, data, resources, xCaption, yCaption }) {
  return <UseOverTime
    url={resources.useOverTime.url}
    hasLoaded={!!resources.useOverTime.hasLoaded}
    params={params}
    data={{
      ...data,
      useOverTime: resources.useOverTime.records[0],
    }}
    xCaption={xCaption}
    yCaption={yCaption}
  />;
}


UseOverTimeLoader.manifest = {
  useOverTime: {
    type: 'okapi',
    path: 'eusage-reports/stored-reports/use-over-time',
    params: (_q, _p, _r, _l, props) => {
      const aId = props.data.agreement.id;
      if (!aId) return null;
      return {
        agreementId: aId,
        startDate: props.params.startDate,
        endDate: props.params.endDate,
        format: props.params.format,
        includeOA: props.params.includeOA,
        accessCountPeriod: props.params.accessCountPeriod,
      };
    },
  },
};


UseOverTimeLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.shape({
    report: PropTypes.string.isRequired, // uot, rbu, etc.
    format: PropTypes.string.isRequired, // j=journal, b=book, etc.
    includeOA: PropTypes.bool.isRequired,
    startDate: PropTypes.string.isRequired, // ISO-format date
    endDate: PropTypes.string.isRequired, // ISO-format date
    accessCountPeriod: PropTypes.string.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    useOverTime: PropTypes.shape({
      url: PropTypes.string, // Not .isRequired, as this is briefly undefined
      hasLoaded: PropTypes.bool, // In truth, this is .isRequired, but the test mocks can't provide it
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
  xCaption: PropTypes.string.isRequired,
  yCaption: PropTypes.string.isRequired,
};


export default stripesConnect(UseOverTimeLoader);
