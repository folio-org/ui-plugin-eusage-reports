import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import EusageVisualization from '../components/EusageVisualization';


function EusageVisualizationLoader({ data, resources }) {
  return <EusageVisualization
    hasLoaded={resources.titleData.hasLoaded && resources.reportData.hasLoaded}
    data={{
      ...data,
      titleData: resources.titleData.records,
      reportData: resources.reportData.records,
    }}
  />;
}


EusageVisualizationLoader.manifest = {
  titleData: {
    type: 'okapi',
    path: 'eusage-reports/title-data',
    records: 'data',
  },
  reportData: {
    type: 'okapi',
    path: 'eusage-reports/report-data',
    records: 'data',
  },
};


EusageVisualizationLoader.propTypes = {
  data: PropTypes.object, // XXX add isRequired once ui-agreements is update to pass it
  resources: PropTypes.shape({
    titleData: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
    reportData: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
};


export default stripesConnect(EusageVisualizationLoader);
