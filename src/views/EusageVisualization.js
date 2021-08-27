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
  Button,
} from '@folio/stripes/components';
import { Monthpicker } from '../components';
import UseOverTimeLoader from '../loaders/UseOverTimeLoader';
import RequestsByDateOfUseLoader from '../loaders/RequestsByDateOfUseLoader';
import RequestsByPublicationYearLoader from '../loaders/RequestsByPublicationYearLoader';
import performLongOperation from '../util/performLongOperation';
import css from './EusageVisualization.css';


function analyzeAgreement(okapiKy, callout, data) {
  performLongOperation(okapiKy, callout,
    'analyze-agreement',
    'eusage-reports/report-data/from-agreement',
    { agreementId: data.agreement.id },
    { agreement: data.agreement.name, i: x => <i>{x}</i> });
}


const reports = [
  { value: 'uot', tag: 'use-over-time', component: UseOverTimeLoader },
  { value: 'rbu', tag: 'requests-by-date-of-use', component: RequestsByDateOfUseLoader },
  { value: 'rbp', tag: 'requests-by-publication-year', component: RequestsByPublicationYearLoader },
  { value: 'cpu', tag: 'cost-per-use' },
];


function yearsBefore(base, n) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const day = base.getDate();
  return new Date(year - n, month, day + 1); // Why do we need this +1?
}


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

  const [report, setReport] = useState('rbp');
  const [format, setFormat] = useState('JOURNAL');
  const [includeOA, setIncludeOA] = useState('yes');

  const now = new Date();
  const [startDate, setStartDate] = useState(yearsBefore(now, 2).toISOString().substring(0, 7));
  const [endDate, setEndDate] = useState(now.toISOString().substring(0, 7));
  const [countType, setCountType] = useState('total');

  // console.log(`report=${report}, format=${format}, includeOA=${includeOA}, startDate=${startDate}, endDate=${endDate}, countType=${countType}`);

  const className = (report === 'rbp' || report === 'rbu') ? css.enabled : css.disabled;
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
          <Monthpicker
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.start-month' })}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          <Monthpicker
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.end-month' })}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </Col>
        <Col xs={4} className={className}>
          <KeyValue
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.count-type' })}
            value={
              <RadioButtonGroup
                value={countType}
                onChange={e => setCountType(e.target.value)}
              >
                {
                  ['total', 'unique'].map(token => (
                    <RadioButton
                      key={token}
                      value={token}
                      label={intl.formatMessage({ id: `ui-plugin-eusage-reports.report-form.count-type.${token}` })}
                    />
                  ))
                }
              </RadioButtonGroup>
            }
          />
        </Col>
      </Row>

      <Chart data={data} params={{ report, format, includeOA: (includeOA === 'yes'), startDate, endDate, countType }} />
      <br />

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
