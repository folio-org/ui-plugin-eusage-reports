import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { AccordionSet, Accordion, Row, Col, KeyValue } from '@folio/stripes/components';


function MatchingSummary({ data, resources }) {
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
            value="Pending review"
          />
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.records-loaded" />}
            value="50"
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.matched" />}
            value="48"
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.unmatched" />}
            value="2"
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.ignored" />}
            value="Pending review"
          />
        </Col>
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
      harvestingDate: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    reportTitles: PropTypes.object, // XXX tighten up
    titleData: PropTypes.object, // XXX tighten up
  }).isRequired,
};


export default stripesConnect(MatchingSummary);
