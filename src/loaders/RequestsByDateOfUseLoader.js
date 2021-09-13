import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import RequestsByDateOfUse from '../reports/RequestsByDateOfUse';


function RequestsByDateOfUseLoader({ params, data, resources }) {
  return <RequestsByDateOfUse
    url={resources.requestsByDateOfUse.url}
    hasLoaded={resources.requestsByDateOfUse.hasLoaded}
    params={params}
    data={{
      ...data,
      requestsByDateOfUse: resources.requestsByDateOfUse.records[0],
    }}
  />;
}


RequestsByDateOfUseLoader.manifest = {
  requestsByDateOfUse: {
    type: 'okapi',
    path: 'eusage-reports/stored-reports/reqs-by-date-of-use',
    params: (_q, _p, _r, _l, props) => {
      const aId = props.data.agreement.id;
      if (!aId) return null;
      return {
        agreementId: aId,
        startDate: props.params.startDate,
        endDate: props.params.endDate,
        includeOA: props.params.includeOA,
        accessCountPeriod: props.params.accessCountPeriod,
        yopInterval: props.params.yopInterval,
      };
    },
  },
};


RequestsByDateOfUseLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.shape({
    report: PropTypes.string.isRequired, // uot, rbu, etc.
    // format: PropTypes.string.isRequired, // j=journal, b=book, etc.
    includeOA: PropTypes.bool.isRequired,
    startDate: PropTypes.string.isRequired, // ISO-format date
    endDate: PropTypes.string.isRequired, // ISO-format date
    accessCountPeriod: PropTypes.string.isRequired,
    yopInterval: PropTypes.string.isRequired,
    periodOfUse: PropTypes.string.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    requestsByDateOfUse: PropTypes.shape({
      url: PropTypes.string, // Not .isRequired, as this is briefly undefined
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
};


export default stripesConnect(RequestsByDateOfUseLoader);
