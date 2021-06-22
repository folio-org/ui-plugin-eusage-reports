import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import MatchingSummaryView from './MatchingSummaryView';


function MatchingSummaryLoader({ data, resources }) {
  return <MatchingSummaryView data={data} resources={resources} />;
}


MatchingSummaryLoader.manifest = {
  reportTitles: {
    type: 'okapi',
    path: 'eusage-reports/report-titles',
    records: 'titles',
  },
  titleData: {
    type: 'okapi',
    path: 'eusage-reports/title-data',
    records: 'data',
  },
  /*
  // NOT YET USED
  reportData: {
    type: 'okapi',
    path: 'eusage-reports/report-data',
    records: 'data',
  },
  */
};


MatchingSummaryLoader.propTypes = {
  data: PropTypes.shape({
    counterReports: PropTypes.arrayOf(
      PropTypes.object.isRequired, // XXX tighten up
    ),
    usageDataProvider: PropTypes.shape({
      harvestingDate: PropTypes.string,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    reportTitles: PropTypes.object, // XXX tighten up
    titleData: PropTypes.object, // XXX tighten up
  }).isRequired,
};


export default stripesConnect(MatchingSummaryLoader);
