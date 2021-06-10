import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import CostPerUse from './reports/CostPerUse';
import MatchingSummary from './components/MatchingSummary';

const PluginEusageReports = ({ data }) => {
  if (data?.op === 'match-names') {
    return (
      <Accordion
        id="plugin-eusage-reports-titles"
        label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.label" />}
        closedByDefault={false}
      >
        <MatchingSummary />
      </Accordion>
    );
  } else {
    return (
      <Accordion
        id="plugin-eusage-reports-charts"
        label={<FormattedMessage id="ui-plugin-eusage-reports.accordion.label" />}
        closedByDefault={false}
      >
        <CostPerUse />
      </Accordion>
    );
  }
};

PluginEusageReports.eventHandler = (event, _stripes, _data) => (
  event === 'ui-agreements-extension' ? PluginEusageReports : null
);

export default PluginEusageReports;
