import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import MatchingSummaryView from '../components/MatchingSummaryView';


function MatchingSummaryLoader({ data, resources, mutator }) {
  return <MatchingSummaryView
    data={{
      ...data,
      reportTitles: resources.reportTitles.records,
      titleData: resources.titleData.records,
    }}
    mutator={mutator}
  />;
}


MatchingSummaryLoader.manifest = {
  reportTitles: {
    type: 'okapi',
    path: 'eusage-reports/report-titles',
    params: (_q, _p, _r, _l, props) => {
      const udpId = props.data.usageDataProvider.id;
      return udpId ? { providerId: udpId } : null;
    },
    records: 'titles',
  },
  updateReportTitles: {
    type: 'okapi',
    path: 'eusage-reports/report-titles',
    fetch: false,
  },
  titleData: {
    type: 'okapi',
    path: 'eusage-reports/title-data',
    records: 'data',
  },
};


MatchingSummaryLoader.propTypes = {
  data: PropTypes.shape({
    usageDataProvider: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    reportTitles: PropTypes.object,
    titleData: PropTypes.object,
  }).isRequired,
  mutator: PropTypes.object.isRequired,
};


export default stripesConnect(MatchingSummaryLoader);
