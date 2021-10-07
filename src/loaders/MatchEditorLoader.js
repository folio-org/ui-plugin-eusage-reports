import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect, useStripes } from '@folio/stripes/core';
import { makeQueryFunction, StripesConnectedSource } from '@folio/stripes/smart-components';
import searchableIndexes from '../util/searchableIndexes';
import MatchEditor from '../views/MatchEditor';


const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


const indexNames = Object.keys(searchableIndexes).sort();


function MatchEditorLoader({ matchType, onClose, data, resources, mutator, paneTitleRef }) {
  const stripes = useStripes();
  let [source, setSource] = useState(); // eslint-disable-line prefer-const
  if (!source) {
    source = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'courses');
    setSource(source);
  } else {
    source.update({ resources, mutator }, 'courses');
  }

  const handleNeedMoreData = () => source.fetchMore(RESULT_COUNT_INCREMENT);

  // We would like to determine whether the 'reportTitles' resource
  // has loaded just by looking at resources.reportTitles.hasLoaded,
  // but when that has once become true, it remains forever true, even
  // after the UDB changes and a new data-set needs to be loaded.
  const hasLoaded = (resources.reportTitles.url || '').includes(data.usageDataProvider.id);

  return <MatchEditor
    matchType={matchType}
    onClose={onClose}
    hasLoaded={hasLoaded}
    data={{
      usageDataProvider: data.usageDataProvider,
      query: resources.query, // XXX Do we need this?
      reportTitles: resources.reportTitles.records,
      reportTitlesCount: resources.reportTitles.other?.totalRecords,
    }}
    onNeedMoreData={handleNeedMoreData}
    query={resources.query} // XXX Do we need this?
    source={source}
    mutator={mutator}
    reloadReportTitles={() => mutator.toggleVal.replace(resources.toggleVal ? 0 : 1)}
    paneTitleRef={paneTitleRef}
  />;
}


MatchEditorLoader.manifest = {
  query: {},
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  toggleVal: {
    // We mutate this when we update matches, to force a stripes-connect reload
    initialValue: 0,
  },

  reportTitles: {
    type: 'okapi',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    path: 'eusage-reports/report-titles',
    params: {
      providerId: '!{data.usageDataProvider.id}',
      _unused: '!{resources.toggleVal}',
    },
    UNUSED_params: (_q, _p, _r, _l, props) => {
      const query = makeQueryFunction(
        'cql.allRecords=1',
        indexNames.map(index => `${index}="%{query.query}*"`).join(' or '),
        {},
        [],
      );
      const params = {
        // query,
        _unused: props.resources.toggleVal,
        limit: 1000,
      };
      const udpId = props.data.usageDataProvider.id;
      if (udpId) params.providerId = udpId;
      return params;
    },
    records: 'titles',
  },
  updateReportTitles: {
    type: 'okapi',
    path: 'eusage-reports/report-titles',
    fetch: false,
    throwErrors: false,
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
    reportTitles: PropTypes.shape({
      url: PropTypes.string,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
      other: PropTypes.shape({
        totalRecords: PropTypes.number.isRequired,
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
  paneTitleRef: PropTypes.object.isRequired,
};


export default stripesConnect(MatchEditorLoader);
