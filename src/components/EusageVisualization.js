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
  Accordion,
} from '@folio/stripes/components';
import UseOverTimeLoader from '../loaders/UseOverTimeLoader';
import CostPerUse from '../reports/CostPerUse';
import performLongOperation from '../util/performLongOperation';


function analyzeAgreement(okapiKy, callout, data) {
  let id;
  let name;
  if (data.agreement) {
    id = data.agreement.id;
    name = data.agreement.name;
  } else {
    // This is an ugly hack, but should work until we have ui-agreements passing in the information
    id = window.location.pathname.replace(/.*\//, '');
    name = '(unnamed agreement)';
  }

  performLongOperation(okapiKy, callout,
    'analyze-agreement',
    'eusage-reports/report-data/from-agreement',
    { agreementId: id },
    { agreement: name, i: x => <i>{x}</i> });
}


function EusageVisualization({ data }) {
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);
  const intl = useIntl();

  const reportOptions = [
    { value: 'uot', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.report.use-over-time' }) },
    { value: 'rbu', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.report.requests-by-date-of-use' }) },
    { value: 'rbp', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.report.requests-by-publication-year' }) },
    { value: 'cpu', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.report.cost-per-use' }) },
  ];

  const reportName2component = {
    uot: UseOverTimeLoader,
    cpu: CostPerUse,
  };

  const formatOptions = [
    { value: 'j', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.journals' }) },
    { value: 'b', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.books' }) },
    { value: 'd', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.databases' }) },
  ];

  const [report, setReport] = useState('uot');
  const [format, setFormat] = useState('j');
  const [includeOA, setIncludeOA] = useState('yes');
  const [startDate, setStartDate] = useState('2021-07-05'); // XXX change
  const [endDate, setEndDate] = useState('2021-07-05'); // XXX change

  // console.log('report =', report, '-- format =', format, '-- includeOA =', includeOA, '-- startDate =', startDate, '-- endDate =', endDate);

  const Chart = reportName2component[report] || (() => `${report} report not implemented`);

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
            onChange={e => setStartDate(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <Datepicker
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.end-month' })}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </Col>
        {/* No third column in this row */}
      </Row>

      <Chart data={data} />

      <Button onClick={() => analyzeAgreement(okapiKy, callout, data)}>
        <FormattedMessage id="ui-plugin-eusage-reports.button.analyze-agreement" />
      </Button>

      <Accordion closedByDefault label={`${data.useOverTime?.length} use-over-time entries`}>
        <pre>
          {JSON.stringify(data.useOverTime, null, 2)}
        </pre>
      </Accordion>
    </>
  );
}


EusageVisualization.propTypes = {
  data: PropTypes.shape({
    useOverTime: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
  }).isRequired,
};


export default EusageVisualization;
