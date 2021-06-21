import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { AccordionSet, Accordion, Row, Col, KeyValue } from '@folio/stripes/components';


function MatchingSummary({ data, resources }) {
  const { records } = resources.reportTitles;
  const categories = [
    { key: 'loaded', value: records.length },
    { key: 'matched', value: records.filter(r => r.kbTitleId).length },
    { key: 'unmatched', value: records.filter(r => !r.kbTitleId && !r.kbManualMatch).length },
    { key: 'ignored', value: records.filter(r => !r.kbTitleId && r.kbManualMatch).length },
  ];
  const nUnmatched = categories.filter(c => c.key === 'unmatched')[0].value;

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
            value={<FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.status.${nUnmatched === 0 ? 'reviewed' : 'pending'}`} />}
          />
        </Col>
      </Row>

      <Row>
        {
          categories.map(cat => (
            <Col key={cat.key} xs={3}>
              <KeyValue
                label={<FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.${cat.key}`} />}
                value={cat.value}
              />
            </Col>
          ))
        }
      </Row>

      <hr />
      <AccordionSet>
        <Accordion closedByDefault label={`${data.counterReports.length} COUNTER Reports`}>
          <pre>
            {JSON.stringify(data.counterReports, null, 2)}
          </pre>
        </Accordion>

        <Accordion closedByDefault label={`${resources.reportTitles.records.length} report titles`}>
          <pre>
            {JSON.stringify(resources.reportTitles.records, null, 2)}
          </pre>
        </Accordion>

        <Accordion closedByDefault label={`${resources.titleData.records.length} title-data entries`}>
          <pre>
            {JSON.stringify(resources.titleData.records, null, 2)}
          </pre>
        </Accordion>
      </AccordionSet>
    </>
  );
}


MatchingSummary.manifest = {
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


MatchingSummary.propTypes = {
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


export default stripesConnect(MatchingSummary);
