import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import EusageVisualization from '../views/EusageVisualization';


function EusageVisualizationLoader({ data, resources, mutator }) {
  return <EusageVisualization
    lastUpdatedHasLoaded={resources.reportStatus.hasLoaded && !resources.reportStatus.failed}
    data={{
      ...data,
      // Once any agreement's status has been successfully fetched,
      // stripes-connect apparently continues to include its content
      // in the result of subsequent unsuccessful fetches. To avoid
      // reporting old good records when we should be getting new
      // failures, we have to explicitly check for failure
      reportStatus: resources.reportStatus.records[0],
    }}
    reloadReportStatus={() => mutator.toggleVal.replace(resources.toggleVal ? 0 : 1)}
  />;
}


EusageVisualizationLoader.manifest = {
  toggleVal: {
    // We mutate this when analyze an agreement, to force a stripes-connect reload
    initialValue: 0,
  },
  reportStatus: {
    type: 'okapi',
    path: (_q, _p, _r, _l, props) => {
      const agreementId = props.data.agreement.id;
      if (!agreementId) return null;
      return `eusage-reports/report-data/status/${agreementId}?_unused=${props.resources.toggleVal}`;
    },
    throwErrors: false,
  },
};


EusageVisualizationLoader.propTypes = {
  data: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    toggleVal: PropTypes.number.isRequired,
    reportStatus: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      failed: PropTypes.oneOfType([
        PropTypes.bool.isRequired,
        PropTypes.object.isRequired,
      ]).isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    toggleVal: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};


export default stripesConnect(EusageVisualizationLoader);
