import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IfPermission } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';
import MatchingSummary from './loaders/MatchingSummaryLoader';
import EusageVisualizationLoader from './loaders/EusageVisualizationLoader';
import 'chart.js/auto';

// Thank Michal Kuklis for the seeds of this abomination :-)
//
function disablePropTypesChecks(disable) {
  if (disable) {
    // eslint-disable-next-line no-console
    const error = console.error;
    // eslint-disable-next-line no-console
    console.error = function errorIgnoringPropTypes(...args) {
      const [message,, detail] = args;
      if (/Failed (prop|%s) type/.test(message) &&
          /entity(Id|Name).*NotesSmartAccordion/.test(detail)) {
        return;
      }
      error.apply(console, args);
    };
  }
}


const PluginEusageReports = ({ data }) => {
  disablePropTypesChecks(true);

  if (data?.op === 'match-names') {
    return (
      <IfPermission perm="plugin-eusage-reports.edit-matches">
        <Accordion
          id="plugin-eusage-reports-titles"
          label={<FormattedMessage id="ui-plugin-eusage-reports.matching-summary.label" />}
          closedByDefault
        >
          <MatchingSummary data={data?.data} />
        </Accordion>
      </IfPermission>
    );
  } else {
    return data?.data?.agreement?.usageDataProviders?.length ? (
      <IfPermission perm="plugin-eusage-reports.view-charts">
        <Accordion
          id="plugin-eusage-reports-charts"
          label={<FormattedMessage id="ui-plugin-eusage-reports.accordion.label" />}
          closedByDefault
        >
          <EusageVisualizationLoader data={data?.data} />
        </Accordion>
      </IfPermission>
    ) : null;
  }
};

PluginEusageReports.eventHandler = (event, _stripes, _data) => (
  event === 'ui-agreements-extension' ? PluginEusageReports : null
);

PluginEusageReports.propTypes = {
  data: PropTypes.shape({
    op: PropTypes.string,
    data: PropTypes.object.isRequired,
  }),
};

export default PluginEusageReports;
