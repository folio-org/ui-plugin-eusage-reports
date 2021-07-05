import { useState } from 'react';
import PropTypes from 'prop-types';
import { Loading, Row, Col, Select, RadioButtonGroup, RadioButton, Datepicker, Accordion } from '@folio/stripes/components';
import CostPerUse from '../reports/CostPerUse';


const reportOptions = [ // XXX i18n
  { value: 'cpu', label: 'Cost per use' },
  { value: 'ubm', label: 'Use by month' },
  { value: 'ubpy', label: 'Use by publication year' }
];

const formatOptions = [ // XXX i18n
  { value: 'j', label: 'Journals' },
  { value: 'b', label: 'Books' },
  { value: 'd', label: 'Databases' }
];


function EusageVisualization({ hasLoaded, data }) {
  const [report, setReport] = useState('cpu');
  const [format, setFormat] = useState('j');
  const [includeOA, setIncludeOA] = useState('yes');
  const [startDate, setStartDate] = useState('2021-07-05'); // XXX change
  const [endDate, setEndDate] = useState('2021-07-05'); // XXX change
  console.log('report =', report, '-- format =', format, '-- includeOA =', includeOA, '-- startDate =', startDate, '-- endDate =', endDate);

  if (!hasLoaded) return <Loading />;

  return (
    <>
      <Row>
        <Col xs={4}>
          <Select
            label="XXX Report"
            dataOptions={reportOptions}
            value={report}
            onChange={e => setReport(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <Select
            label="XXX Format"
            dataOptions={formatOptions}
            value={format}
            onChange={e => setFormat(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <RadioButtonGroup
            label="XXX Include Open Access use?"
            value={includeOA}
            onChange={e => setIncludeOA(e.target.value)}
          >
            <RadioButton label="XXX Yes" value="yes" />
            <RadioButton label="XXX No" value="no" />
          </RadioButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Datepicker
            label="XXX Start month"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <Datepicker
            label="XXX End month"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </Col>
        {/* No third column in this row */}
      </Row>
      <CostPerUse data={data} />
      <Accordion closedByDefault label={`${data.titleData.length} title-data entries`}>
        <pre>
          {JSON.stringify(data.titleData, null, 2)}
        </pre>
      </Accordion>
    </>
  );
}


EusageVisualization.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    titleData: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
  }).isRequired,
};


export default EusageVisualization;
