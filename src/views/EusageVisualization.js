import { useState, useContext } from 'react';
import { useIntl, FormattedMessage, FormattedDate } from 'react-intl';
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
import CostPerUseLoader from '../loaders/CostPerUseLoader';
import performLongOperation from '../util/performLongOperation';
import css from './EusageVisualization.css';


function AnalysisOngoing() {
  return (
    <div className={css.ongoing}>
      <FormattedMessage id="ui-plugin-eusage-reports.analyze-agreement.ongoing" />
    </div>
  );
}


// eslint-disable-next-line react/prop-types
function DateLastAnalyzed({ loaded, isoDateTime }) {
  // Render according to the browser's (and therefore user's) timezone, not tenant's

  return (
    <>
      <FormattedMessage id="ui-plugin-eusage-reports.last-analyzed" />
      <span>: </span>
      {
        !loaded ?
          <FormattedMessage id="ui-plugin-eusage-reports.last-analyzed.unknown" /> :
          <>
            <FormattedDate value={isoDateTime} />
            <span>, </span>
            {/* eslint-disable-next-line react/prop-types */}
            {isoDateTime.replace(/.*T(.*)\..*/, '$1')}
            <span> </span>
            UCT
          </>
      }
    </>
  );
}

function analyzeAgreement(okapiKy, callout, data, setAnalysisOngoing, reloadReportStatus) {
  setAnalysisOngoing(true);
  performLongOperation(okapiKy, callout,
    'analyze-agreement',
    'eusage-reports/report-data/from-agreement',
    { agreementId: data.agreement.id },
    { agreement: data.agreement.name, i: x => <i>{x}</i> },
    () => { setAnalysisOngoing(false); reloadReportStatus(); });
}


const reports = [
  { value: 'uot', tag: 'use-over-time', component: UseOverTimeLoader },
  { value: 'rbu', tag: 'requests-by-date-of-use', component: RequestsByDateOfUseLoader },
  { value: 'rbp', tag: 'requests-by-publication-year', component: RequestsByPublicationYearLoader },
  { value: 'cpu', tag: 'cost-per-use', component: CostPerUseLoader },
];


const accessCountPeriodOptions = ['1M', '6M', '1Y', '2Y', '5Y', '10Y'];
const yopIntervalOptions = ['1Y', '2Y', '5Y', '10Y'];
const periodOfUseOptions = accessCountPeriodOptions;


function yearsBefore(base, n) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const day = base.getDate();
  return new Date(year - n, month, day + 1); // Why do we need this +1?
}


function EusageVisualization({ data, lastUpdatedHasLoaded, reloadReportStatus }) {
  const okapiKy = useOkapiKy();
  const callout = useContext(CalloutContext);
  const intl = useIntl();

  const reportOptions = reports.map(r => ({
    value: r.value,
    label: intl.formatMessage({ id: `ui-plugin-eusage-reports.report-form.report.${r.tag}` }),
  }));

  const makeOptions = (list) => list.map(x => ({
    value: x,
    label: intl.formatMessage(
      { id: `ui-plugin-eusage-reports.report-form.period.${x.slice(-1)}` },
      { count: x.slice(0, -1) },
    ),
  }));

  const reportName2component = {};
  reports.forEach(r => {
    if (r.component) reportName2component[r.value] = r.component;
  });

  const formatOptions = [
    { value: 'JOURNAL', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.journals' }) },
    { value: 'BOOK', label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.format.books' }) },
  ];

  const [report, setReport] = useState('uot');
  const [persistentFormat, setFormat] = useState('JOURNAL');
  const [includeOA, setIncludeOA] = useState('yes');

  const now = new Date();
  const [startDate, setStartDate] = useState(yearsBefore(now, 2).toISOString().substring(0, 7));
  const [endDate, setEndDate] = useState(now.toISOString().substring(0, 7));
  const [countType, setCountType] = useState('total');

  const [accessCountPeriod, setAccessCountPeriod] = useState('1Y');
  const [yopInterval, setYopInterval] = useState('5Y');
  const [periodOfUse, setPeriodOfUse] = useState('1Y');

  // console.log(`report=${report}, format=${format}, includeOA=${includeOA}, startDate=${startDate}, endDate=${endDate}, countType=${countType}`);

  const format = (report === 'uot' || report === 'cpu') ? persistentFormat : 'JOURNAL';
  const formatClassName = (report === 'uot' || report === 'cpu') ? css.enabled : css.disabled;
  const countTypeClassName = (report === 'rbp' || report === 'rbu') ? css.enabled : css.disabled;
  const Chart = reportName2component[report] || (() => <p><b>{report}</b> report not implemented</p>);

  const [analysisOngoing, setAnalysisOngoing] = useState(false);

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
        <Col xs={4} className={formatClassName}>
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
        <Col xs={4} className={countTypeClassName}>
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
      <Row>
        <Col xs={4}>
          <Select
            label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.access-count-period' })}
            dataOptions={makeOptions(accessCountPeriodOptions)}
            value={accessCountPeriod}
            onChange={e => setAccessCountPeriod(e.target.value)}
          />
        </Col>
        <Col xs={4}>
          {
            report === 'rbu' ?
              <Select
                label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.yop-interval' })}
                dataOptions={makeOptions(yopIntervalOptions)}
                value={yopInterval}
                onChange={e => setYopInterval(e.target.value)}
              />
              : report === 'rbp' ?
                <Select
                  label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.report-form.period-of-use' })}
                  dataOptions={makeOptions(periodOfUseOptions)}
                  value={periodOfUse}
                  onChange={e => setPeriodOfUse(e.target.value)}
                />
                : null
          }
        </Col>
        {/* There no column 3 in this row */}
      </Row>


      {
        analysisOngoing ?
          <AnalysisOngoing /> :
          <Chart
            data={data}
            params={{
              report,
              format,
              includeOA: (includeOA === 'yes'),
              startDate,
              endDate,
              countType,
              accessCountPeriod,
              yopInterval,
              periodOfUse,
            }}
          />
      }
      <br />

      <div>
        <div style={{ float: 'left' }}>
          <Button onClick={() => analyzeAgreement(okapiKy, callout, data, setAnalysisOngoing, reloadReportStatus)}>
            <FormattedMessage id="ui-plugin-eusage-reports.button.analyze-agreement" />
          </Button>
        </div>
        <div style={{ float: 'right' }}>
          <DateLastAnalyzed loaded={lastUpdatedHasLoaded} isoDateTime={data.reportStatus?.lastUpdated} intl={intl} />
        </div>
      </div>

      <div style={{ height: '30em' }} />
    </>
  );
}


EusageVisualization.propTypes = {
  data: PropTypes.shape({
    useOverTime: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
    reportStatus: PropTypes.shape({
      lastUpdated: PropTypes.string.isRequired,
    }),
    agreement: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  lastUpdatedHasLoaded: PropTypes.bool.isRequired,
  reloadReportStatus: PropTypes.func.isRequired,
};


export default EusageVisualization;
