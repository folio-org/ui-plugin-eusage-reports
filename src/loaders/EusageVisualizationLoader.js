import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import EusageVisualization from '../components/EusageVisualization';


function EusageVisualizationLoader({ data, resources }) {
  return <EusageVisualization
    hasLoaded={resources.useOverTime.hasLoaded}
    data={{
      ...data,
      useOverTime: resources.useOverTime.records,
    }}
  />;
}


EusageVisualizationLoader.manifest = {
  useOverTime: {
    type: 'okapi',
    path: 'eusage-reports/stored-reports/use-over-time',
    params: (_q, _p, _r, _l, props) => {
      const aId = props.data.agreement.id;
      if (!aId) return null;
      return ({
        agreementId: aId,
        startDate: '1970-01-01', // XXX set from UI
        endDate: '2999-12-31', // XXX set from UI
      });
    },
  },
};


EusageVisualizationLoader.propTypes = {
  data: PropTypes.object, // XXX add isRequired once ui-agreements is updated to pass it
  resources: PropTypes.shape({
    useOverTime: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
};


export default stripesConnect(EusageVisualizationLoader);
