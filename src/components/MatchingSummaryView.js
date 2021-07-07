/* eslint-disable no-alert */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { useOkapiKy, CalloutContext } from '@folio/stripes/core';
import { AccordionSet, Accordion, Row, Col, KeyValue, Loading, Layer, Button } from '@folio/stripes/components';
import MatchEditorLoader from '../loaders/MatchEditorLoader';
import generateTitleCategories from '../util/generateTitleCategories';


function updateMatches(okapiKy, callout, data) {
  let mostRecentReport;
  data.counterReports.forEach(counterReport => {
    if (!mostRecentReport || counterReport.year > mostRecentReport.year) {
      mostRecentReport = counterReport;
    }
  });

  if (!mostRecentReport) {
    alert('no most recent report');
    return;
  }

  let trReport;
  mostRecentReport.reportsPerType.forEach(report => {
    if (report.reportType === 'TR') {
      trReport = report;
    }
  });

  if (!trReport) {
    alert('no TR report in most recent year');
    return;
  }

  let mostRecentSegment;
  trReport.counterReports.forEach(segment => {
    if (!mostRecentSegment || segment.yearMonth > mostRecentSegment.yearMonth) {
      mostRecentSegment = segment;
    }
  });

  if (!mostRecentSegment) {
    alert('no segment in TR report for most recent year');
    return;
  }

  const p = okapiKy('eusage-reports/report-titles/from-counter', {
    method: 'POST',
    json: { counterReportId: mostRecentSegment.id }
  });
  callout.sendCallout({
    message: <FormattedMessage
      id="ui-plugin-eusage-reports.button.update-matches.dispatched"
      values={{ yearMonth: mostRecentSegment.yearMonth }}
    />
  });

  p.then(() => {
    callout.sendCallout({
      message: <FormattedMessage
        id="ui-plugin-eusage-reports.button.update-matches.completed"
        values={{ yearMonth: mostRecentSegment.yearMonth }}
      />
    });
  }).catch(err => {
    callout.sendCallout({
      type: 'error',
      message: <FormattedMessage
        id="ui-plugin-eusage-reports.button.update-matches.error"
        values={{ error: err.toString() }}
      />
    });
  });
}


function MatchingSummaryView({ hasLoaded, data, mutator }) {
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);

  const matchType = data.query.matchType;
  const matchTitlesOfType = (key) => mutator.query.update({ matchType: key });

  const categories = generateTitleCategories(data.reportTitles);
  const nUnmatched = categories.filter(c => c.key === 'unmatched')[0].data.length;
  const status = nUnmatched === 0 ? 'reviewed' : 'pending';

  const pluginPaneTitleRef = React.useRef();
  const focusHandler = () => {
    // eslint-disable-next-line no-unused-expressions
    pluginPaneTitleRef.current?.focus();
  };

  return (
    <>
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
            value={<FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.status.${status}`} />}
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
                    <span style={{ color: '#008', textDecoration: 'underline' }}>{cat.data.length}</span> :
                    <Loading />
                }
              />
            </Col>
          ))
        }
      </Row>

      <Button onClick={() => updateMatches(okapiKy, callout, data)}>
        <FormattedMessage id="ui-plugin-eusage-reports.button.update-matches" />
      </Button>

      <hr />
      <AccordionSet>
        <Accordion closedByDefault label={`${data.counterReports.length} COUNTER Reports`}>
          <pre>
            {JSON.stringify(data.counterReports, null, 2)}
          </pre>
        </Accordion>

        <Accordion closedByDefault label={`${data.reportTitles.length} report titles`}>
          <pre>
            {JSON.stringify(data.reportTitles, null, 2)}
          </pre>
        </Accordion>
      </AccordionSet>

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
    </>
  );
}


MatchingSummaryView.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    query: PropTypes.object.isRequired,
    counterReports: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
    usageDataProvider: PropTypes.shape({
      harvestingDate: PropTypes.string,
    }).isRequired,
    reportTitles: PropTypes.arrayOf(
      PropTypes.shape({
        kbTitleId: PropTypes.string,
        kbManualMatch: PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};


export default MatchingSummaryView;
