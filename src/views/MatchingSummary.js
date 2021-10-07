import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { useStripes, useOkapiKy, CalloutContext } from '@folio/stripes/core';
import { AccordionSet, Accordion, Row, Col, KeyValue, Loading, Layer, Button } from '@folio/stripes/components';
import MatchEditorLoader from '../loaders/MatchEditorLoader';
import performLongOperation from '../util/performLongOperation';


function updateMatches(okapiKy, callout, data, reloadReportTitles) {
  performLongOperation(okapiKy, callout,
    'update-matches',
    'eusage-reports/report-titles/from-counter',
    { providerId: data.usageDataProvider.id },
    { yearMonth: data.usageDataProvider.label },
    reloadReportTitles);
}


function MatchingSummary({ hasLoaded, data, mutator, reloadReportTitles }) {
  const stripes = useStripes();
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);

  const matchType = data.query.matchType;
  const matchTitlesOfType = (key) => mutator.query.update({ matchType: key });

  const categories = data.categories;
  const nUnmatched = categories.filter(c => c.key === 'unmatched')[0].count;
  const status = nUnmatched > 0 ? 'pending' : data.reportTitlesCount > 0 ? 'reviewed' : 'no-records';

  const pluginPaneTitleRef = React.useRef();
  const focusHandler = () => {
    // eslint-disable-next-line no-unused-expressions
    pluginPaneTitleRef.current?.focus();
  };

  return (
    <div data-test-matching-summary>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.date-of-last-harvest" />}
            value={<FormattedDate value={data.usageDataProvider.harvestingDate} />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.status" />}
            value={
              hasLoaded ?
                <FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.status.${status}`} /> :
                <Loading />
            }
          />
        </Col>
      </Row>

      <Row>
        {
          categories.map(cat => (
            <Col key={cat.key} xs={3} onClick={() => matchTitlesOfType(cat.key)} style={{ cursor: 'pointer' }}>
              <KeyValue
                label={<FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.${cat.key}`} />}
                value={
                  hasLoaded ?
                    <span style={{ color: '#008', textDecoration: 'underline' }}>
                      {
                        (cat.key !== 'loaded' || cat.count === data.reportTitlesCount) ?
                          cat.count :
                          `${cat.count} of ${data.reportTitlesCount}`
                      }
                    </span> :
                    <Loading />
                }
              />
            </Col>
          ))
        }
      </Row>

      <Button onClick={() => updateMatches(okapiKy, callout, data, reloadReportTitles)}>
        <FormattedMessage id="ui-plugin-eusage-reports.button.update-matches" />
      </Button>

      {stripes.config.showDevInfo &&
        <>
          <hr />
          <AccordionSet>
            <Accordion closedByDefault label={`${data.counterReports.length} COUNTER Reports`}>
              <pre>
                {JSON.stringify(data.counterReports, null, 2)}
              </pre>
            </Accordion>
          </AccordionSet>
        </>
      }

      {
        data.query.matchType &&
        <Layer isOpen contentLabel="Match editor" afterOpen={focusHandler}>
          <MatchEditorLoader
            onClose={() => matchTitlesOfType(null)}
            matchType={matchType}
            data={data}
            mutator={mutator}
            paneTitleRef={pluginPaneTitleRef}
          />
        </Layer>
      }
    </div>
  );
}


MatchingSummary.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    query: PropTypes.object.isRequired,
    counterReports: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
    usageDataProvider: PropTypes.shape({
      harvestingDate: PropTypes.string,
    }).isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        count: PropTypes.number,
      }).isRequired,
    ).isRequired,
    reportTitlesCount: PropTypes.number,
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  reloadReportTitles: PropTypes.func.isRequired,
};


export default MatchingSummary;
