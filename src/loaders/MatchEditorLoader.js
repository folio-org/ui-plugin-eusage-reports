import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect, useStripes } from '@folio/stripes/core';
import { makeQueryFunction, StripesConnectedSource } from '@folio/stripes/smart-components';
import searchableIndexes from '../util/searchableIndexes';
import MatchEditor from '../views/MatchEditor';


const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


const indexNames = Object.keys(searchableIndexes).sort();


function MatchEditorLoader({ matchType, onClose, paneTitleRef, data, resources, mutator }) {
  const stripes = useStripes();

  let [source, setSource] = useState(); // eslint-disable-line prefer-const
  if (!source) {
    source = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'reportTitles');
    setSource(source);
  } else {
    source.update({ resources, mutator }, 'reportTitles');
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
    paneTitleRef={paneTitleRef}
    data={{
      usageDataProvider: data.usageDataProvider,
      categories: data.categories,
      reportTitles: resources.reportTitles.records,
      reportTitlesCount: resources.reportTitles.other?.totalRecords, // XXX Do we need this?
    }}
    query={resources.query}
    source={source}
    mutator={mutator}
    hasLoaded={hasLoaded}
    onNeedMoreData={handleNeedMoreData}
  />;
}


MatchEditorLoader.manifest = {
  query: {},
  resultCount: {
    // Implicitly mutated by source.fetchMore()
    initialValue: INITIAL_RESULT_COUNT
  },
  toggleVal: {
    // We mutate this when we update matches, to force a stripes-connect reload
    initialValue: 0,
  },
  reportTitles: {
    type: 'okapi',
    path: 'eusage-reports/report-titles',
    records: 'titles',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    // We will need to do something with this later when handling searches
    __unused_query: makeQueryFunction(
      'cql.allRecords=1',
      indexNames.map(index => `${index}="%{query.query}*"`).join(' or '),
      {}, // XXX sortMap
      [], // XXX filterConfig
    ),
    params: (_q, _p, _r, _l, props) => {
      function matchType2query(t) {
        switch (t) {
          case 'loaded': return undefined;
          case 'matched': return 'kbTitleId<>""';
          // It seems wrong that we have to do our own URL-encoding here
          case 'unmatched': return 'kbTitleId="" and kbManualMatch=false';
          case 'ignored': return 'kbTitleId="" and kbManualMatch=true';
          default:
            console.error('impossible match-type', t); // eslint-disable-line no-console
            return undefined;
        }
      }

      const udpId = props.data.usageDataProvider.id;
      if (!udpId) return undefined;
      return {
        providerId: udpId,
        query: matchType2query(props.matchType),
        _unused: props.resources.toggleVal,
      };
    },
  },
};


MatchEditorLoader.propTypes = {
  matchType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    usageDataProvider: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        count: PropTypes.number,
      }).isRequired,
    ).isRequired,
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
