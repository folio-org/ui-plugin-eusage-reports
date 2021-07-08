import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import MatchingSummary from './loaders/MatchingSummaryLoader';
import EusageVisualizationLoader from './loaders/EusageVisualizationLoader';


// Thank Michal Kuklis for this abomination :-)
//
function disablePropTypesChecks(disable) {
  if (disable) {
    // eslint-disable-next-line no-console
    const error = console.error;
    // eslint-disable-next-line no-console
    console.error = function errorIgnoringPropTypes(...args) {
      if (/Failed (prop|%s) type/.test(args[0])) return;
      error.apply(console, args);
    };
  }
}


const PluginEusageReports = ({ data }) => {
  disablePropTypesChecks(true);

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
        <EusageVisualizationLoader />
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
