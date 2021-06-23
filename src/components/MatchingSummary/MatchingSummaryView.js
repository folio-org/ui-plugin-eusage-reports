import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { AccordionSet, Accordion, Row, Col, KeyValue, Layer } from '@folio/stripes/components';
import MatchEditor from './MatchEditor';
import generateTitleCategories from '../../util/generateTitleCategories';


function MatchingSummaryView({ data }) {
  const [showMatches, setShowMatches] = useState(false);
  const [matchType, setMatchType] = useState();
  const matchTitlesOfType = (key) => { setShowMatches(true); setMatchType(key); };

  const categories = generateTitleCategories(data.reportTitles);
  const nUnmatched = categories.filter(c => c.key === 'unmatched')[0].data.length;

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
            value={<FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.status.${nUnmatched === 0 ? 'reviewed' : 'pending'}`} />}
          />
        </Col>
      </Row>

      <Row>
        {
          categories.map(cat => (
            <Col key={cat.key} xs={3} onClick={() => matchTitlesOfType(cat.key)} style={{ cursor: 'pointer' }}>
              <KeyValue
                label={<FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.${cat.key}`} />}
                value={<span style={{ color: '#008', textDecoration: 'underline' }}>{cat.data.length}</span>}
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

        <Accordion closedByDefault label={`${data.reportTitles.length} report titles`}>
          <pre>
            {JSON.stringify(data.reportTitles, null, 2)}
          </pre>
        </Accordion>

        <Accordion closedByDefault label={`${data.titleData.length} title-data entries`}>
          <pre>
            {JSON.stringify(data.titleData, null, 2)}
          </pre>
        </Accordion>
      </AccordionSet>

      {
        showMatches &&
        <Layer isOpen contentLabel="Match editor" afterOpen={focusHandler}>
          <MatchEditor
            onClose={() => setShowMatches(false)}
            matchType={matchType}
            data={data}
            paneTitleRef={pluginPaneTitleRef}
          />
        </Layer>
      }
    </>
  );
}


MatchingSummaryView.propTypes = {
  data: PropTypes.shape({
    counterReports: PropTypes.arrayOf(
      PropTypes.object.isRequired, // XXX tighten up
    ),
    usageDataProvider: PropTypes.shape({
      harvestingDate: PropTypes.string,
    }).isRequired,
    reportTitles: PropTypes.arrayOf(
      PropTypes.object.isRequired, // XXX tighten up
    ),
    titleData: PropTypes.arrayOf(
      PropTypes.object.isRequired, // XXX tighten up
    ),
  }).isRequired,
};


export default MatchingSummaryView;
