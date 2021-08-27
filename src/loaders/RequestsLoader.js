import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';


function RequestsLoader({ params, data, resources, DisplayComponent }) {
  return <DisplayComponent
    params={params}
    hasLoaded={resources.requestsByPublicationYear.hasLoaded}
    data={{
      ...data,
      requestsByPublicationYear: resources.requestsByPublicationYear.records[0],
    }}
  />;
}


RequestsLoader.manifest = {
  requestsByPublicationYear: {
    type: 'okapi',
    path: 'eusage-reports/stored-reports/reqs-by-pub-year',
    params: (_q, _p, _r, _l, props) => {
      const aId = props.data.agreement.id;
      if (!aId) return null;
      return ({
        agreementId: aId,
        startDate: props.params.startDate,
        endDate: props.params.endDate,
        includeOA: props.params.includeOA,
        periodOfUse: '1Y', // XXX parameterize
      });
    },
  },
};


RequestsLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.shape({
    report: PropTypes.string.isRequired, // uot, rbu, etc.
    format: PropTypes.string.isRequired, // j=journal, b=book, etc.
    includeOA: PropTypes.bool.isRequired,
    startDate: PropTypes.string.isRequired, // ISO-format date
    endDate: PropTypes.string.isRequired, // ISO-format date
  }).isRequired,
  resources: PropTypes.shape({
    requestsByPublicationYear: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
};


export default stripesConnect(RequestsLoader);
