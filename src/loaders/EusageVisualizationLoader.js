import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import EusageVisualization from '../views/EusageVisualization';


function EusageVisualizationLoader({ data, resources }) {
  return <EusageVisualization
    lastUpdatedHasLoaded={resources.reportStatus.hasLoaded}
    data={{
      ...data,
      reportStatus: resources.reportStatus.records[0],
    }}
  />;
}


EusageVisualizationLoader.manifest = {
  reportStatus: {
    type: 'okapi',
    path: (_q, _p, _r, _l, props) => {
      const agreementId = props.data.agreement.id;
      if (!agreementId) return null;
      return `eusage-reports/report-data/status/${agreementId}`;
    },
    throwErrors: false,
  },
};


EusageVisualizationLoader.propTypes = {
  data: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    reportStatus: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
};


export default stripesConnect(EusageVisualizationLoader);
