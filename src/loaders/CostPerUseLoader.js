import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import CostPerUse from '../reports/CostPerUse';


function CostPerUseLoader({ params, data, resources }) {
  return <CostPerUse
    url={resources.costPerUse.url}
    hasLoaded={resources.costPerUse.hasLoaded}
    params={params}
    data={{
      ...data,
      costPerUse: resources.costPerUse.records[0],
    }}
  />;
}


CostPerUseLoader.manifest = {
  costPerUse: {
    type: 'okapi',
    path: 'eusage-reports/stored-reports/cost-per-use',
    params: (_q, _p, _r, _l, props) => {
      const aId = props.data.agreement.id;
      if (!aId) return null;
      return ({
        agreementId: aId,
        startDate: props.params.startDate,
        endDate: props.params.endDate,
        // format: props.params.format, // Not supported on back-end
        includeOA: props.params.includeOA,
      });
    },
  },
};


CostPerUseLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.shape({
    report: PropTypes.string.isRequired, // uot, rbu, etc.
    // format: PropTypes.string.isRequired, // j=journal, b=book, etc.
    includeOA: PropTypes.bool.isRequired,
    startDate: PropTypes.string.isRequired, // ISO-format date
    endDate: PropTypes.string.isRequired, // ISO-format date
  }).isRequired,
  resources: PropTypes.shape({
    costPerUse: PropTypes.shape({
      url: PropTypes.string, // Not .isRequired, as this is briefly undefined
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
};


export default stripesConnect(CostPerUseLoader);
