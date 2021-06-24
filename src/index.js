import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import CostPerUse from './reports/CostPerUse';
import MatchingSummary from './loaders/MatchingSummaryLoader.js';

const PluginEusageReports = ({ data }) => {
  if (data?.op === 'match-names') {
    return (
      <Accordion
        id="plugin-eusage-reports-titles"
        label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.label" />}
        closedByDefault={false}
      >
        <MatchingSummary data={data.data} />
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

PluginEusageReports.propTypes = {
  data: PropTypes.shape({
    op: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  }),
};

export default PluginEusageReports;
