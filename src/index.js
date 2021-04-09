import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';

const PluginEusageReports = () => {
  return (
    <Accordion
      id="plugin-eusage-reports"
      label={<FormattedMessage id="ui-plugin-eusage-reports.accordion.label" />}
      closedByDefault
    >
      Visualization Plugin goes here.
    </Accordion>
  );
};

export default PluginEusageReports;
