import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import CostPerUse from './reports/CostPerUse';

const PluginEusageReports = () => {
  return (
    <Accordion
      id="plugin-eusage-reports"
      label={<FormattedMessage id="ui-plugin-eusage-reports.accordion.label" />}
      closedByDefault
    >
      <CostPerUse />
    </Accordion>
  );
};

export default PluginEusageReports;
