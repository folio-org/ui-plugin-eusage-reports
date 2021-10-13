import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import parseFacets from '../util/parseFacets';
import MatchingSummary from '../views/MatchingSummary';


function MatchingSummaryLoader({ data, resources, mutator }) {
  const rt = resources.reportTitlesSummary;

  // We would like to determine whether the 'reportTitlesSummary' resource
  // has loaded just by looking at rt.hasLoaded, but when that has
  // once become true, it remains forever true, even after the UDB
  // changes and a new data-set needs to be loaded.
  const hasLoaded = (rt.url || '').includes(data.usageDataProvider.id);

  const categories = parseFacets(rt.other?.resultInfo?.facets || []);
  return <MatchingSummary
    hasLoaded={hasLoaded}
    data={{
      ...data,
      query: resources.query,
      categories,
      reportTitlesCount: rt.other?.totalRecords,
    }}
    mutator={mutator}
    reloadReportTitles={() => mutator.toggleVal.replace(resources.toggleVal ? 0 : 1)}
  />;
}


MatchingSummaryLoader.manifest = {
  query: {},
  toggleVal: {
    // We mutate this when we update matches, to force a stripes-connect reload
    initialValue: 0,
  },

  reportTitlesSummary: {
    type: 'okapi',
    path: 'eusage-reports/report-titles',
    params: (_q, _p, _r, _l, props) => {
      const params = {
        facets: 'status',
        limit: 0, // We Only care about the counts in the facets
        _unused: props.resources.toggleVal,
      };
      const udpId = props.data.usageDataProvider.id;
      if (udpId) params.providerId = udpId;
      return params;
    },
    records: 'titles',
  },
};


MatchingSummaryLoader.propTypes = {
  data: PropTypes.shape({
    usageDataProvider: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    reportTitlesSummary: PropTypes.shape({
      url: PropTypes.string,
      other: PropTypes.shape({
        totalRecords: PropTypes.number.isRequired,
        resultInfo: PropTypes.shape({
          facets: PropTypes.arrayOf(
            PropTypes.object.isRequired,
          ).isRequired,
        }),
      }),
    }).isRequired,
    toggleVal: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    toggleVal: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};


export default stripesConnect(MatchingSummaryLoader);
