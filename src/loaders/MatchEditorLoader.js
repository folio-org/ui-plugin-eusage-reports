import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import MatchEditor from '../views/MatchEditor';


function MatchEditorLoader({ matchType, onClose, data, resources, mutator, paneTitleRef }) {
  const rr2r = resources.reportTitles2.records;

  return <MatchEditor
    matchType={matchType}
    onClose={onClose}
    data={{
      usageDataProvider: data.usageDataProvider,
      // Temporarily fill with titles from matching summary, until our own arrive
      reportTitles: rr2r.length === 0 ? data.reportTitles : rr2r,
    }}
    mutator={mutator}
    paneTitleRef={paneTitleRef}
  />;
}


MatchEditorLoader.manifest = {
  query: {},
  reportTitles2: {
    type: 'okapi',
    path: 'eusage-reports/report-titles',
    params: (_q, _p, _r, _l, props) => {
      const params = {
        limit: 1000,
      };
      const udpId = props.data.usageDataProvider.id;
      if (udpId) params.providerId = udpId;
      return params;
    },
    records: 'titles',
  },
};


MatchEditorLoader.propTypes = {
  matchType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    usageDataProvider: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    reportTitles: PropTypes.array.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    reportTitles2: PropTypes.shape({
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
      other: PropTypes.shape({
        totalRecords: PropTypes.number.isRequired,
      }),
    }).isRequired,
    query: PropTypes.object.isRequired,
  }).isRequired,
  mutator: PropTypes.object.isRequired,
  paneTitleRef: PropTypes.object.isRequired,
};


export default stripesConnect(MatchEditorLoader);
