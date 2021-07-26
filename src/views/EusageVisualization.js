import { useState, useContext } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useOkapiKy, CalloutContext } from '@folio/stripes/core';
import {
  Row,
  Col,
  Select,
  KeyValue,
  RadioButtonGroup,
  RadioButton,
  Datepicker,
  Button,
} from '@folio/stripes/components';
import UseOverTimeLoader from '../loaders/UseOverTimeLoader';
import CostPerUse from '../reports/CostPerUse';
import performLongOperation from '../util/performLongOperation';


function analyzeAgreement(okapiKy, callout, data) {
  performLongOperation(okapiKy, callout,
    'analyze-agreement',
    'eusage-reports/report-data/from-agreement',
    { agreementId: data.agreement.id },
    { agreement: data.agreement.name, i: x => <i>{x}</i> });
}


const reports = [
  { value: 'uot', tag: 'use-over-time', component: UseOverTimeLoader },
  { value: 'rbu', tag: 'requests-by-date-of-use' },
  { value: 'rbp', tag: 'requests-by-publication-year' },
  { value: 'cpu', tag: 'cost-per-use', component: CostPerUse },
];


function EusageVisualization({ data }) {
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);
  const intl = useIntl();

  const reportOptions = reports.map(r => ({
    value: r.value,
    label: intl.formatMessage({ id: `ui-plugin-eusage-reports.report-form.report.${r.tag}` }),
  }));

  const reportName2component = {};
  reports.forEach(r => {
    if (r.component) reportName2component[r.value] = r.component;
  });

  const formatOptions = [
    { value: 'JOURNAL', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.journals' }) },
    { value: 'BOOK', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.books' }) },
    { value: 'DATABASE', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.databases' }) },
  ];

  const [report, setReport] = useState('rbu');
  const [format, setFormat] = useState('JOURNAL');
  const [includeOA, setIncludeOA] = useState('yes');
  const [startDate, setStartDate] = useState('2021-07-05'); // XXX change
  const [endDate, setEndDate] = useState('2021-07-05'); // XXX change

  // console.log('report =', report, '-- format =', format, '-- includeOA =', includeOA, '-- startDate =', startDate, '-- endDate =', endDate);

  const Chart = reportName2component[report] || (() => <p><b>{report}</b> report not implemented</p>);

  return (
    <>
      <Row>
        <Col xs={4}>
          <Select
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.report' })}
            dataOptions={reportOptions}
            value={report}
            onChange={e => setReport(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <Select
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format' })}
            dataOptions={formatOptions}
            value={format}
            onChange={e => setFormat(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.include-oa' })}
            value={
              <RadioButtonGroup
                value={includeOA}
                onChange={e => setIncludeOA(e.target.value)}
              >
                {
                  ['yes', 'no'].map(token => (
                    <RadioButton
                      key={token}
                      value={token}
                      label={intl.formatMessage({ id: `ui-plugin-eusage-reports.report-form.include-oa.${token}` })}
                    />
                  ))
                }
              </RadioButtonGroup>
            }
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Datepicker
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.start-month' })}
            value={startDate}
            dateFormat="YYYY-MM-DD"
            onChange={e => setStartDate(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <Datepicker
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.end-month' })}
            value={endDate}
            dateFormat="YYYY-MM-DD"
            onChange={e => setEndDate(e.target.value)}
          />
        </Col>
        {/* No third column in this row */}
      </Row>

      <Chart data={data} params={{ report, format, includeOA: (includeOA === 'yes'), startDate, endDate }} />

      <Button onClick={() => analyzeAgreement(okapiKy, callout, data)}>
        <FormattedMessage id="ui-plugin-eusage-reports.button.analyze-agreement" />
      </Button>
    </>
  );
}


EusageVisualization.propTypes = {
  data: PropTypes.shape({
    useOverTime: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
    agreement: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
};


export default EusageVisualization;
