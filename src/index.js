import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import CostPerUse from './reports/CostPerUse';
import MatchingSummary from './loaders/MatchingSummaryLoader';

const PluginEusageReports = ({ data }) => {
  if (true) { // eslint-disable-line no-constant-condition
    // Thank Michal Kuklis for this abomination :-)
    // eslint-disable-next-line no-console
    const error = console.error;
    // eslint-disable-next-line no-console
    console.error = function errorIgnoringPropTypes(...args) {
      if (/Failed (prop|%s) type/.test(args[0])) return;
      error.apply(console, args);
    };
  }

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
