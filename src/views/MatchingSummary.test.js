import React from 'react';
import { IntlProvider } from 'react-intl';
import { cleanup, render } from '@testing-library/react';

import MatchingSummary from './MatchingSummary';

import rawTranslations from '../../translations/ui-plugin-eusage-reports/en';

const translations = {};
Object.keys(rawTranslations).forEach(key => {
  translations[`ui-plugin-eusage-reports.${key}`] = rawTranslations[key];
});


const renderMatchingSummary = () => {
  const queryData = { matchType: undefined };

  return render(
    <IntlProvider locale="en-US" messages={translations}>
      <MatchingSummary
        hasLoaded
        data={{
          query: queryData,
          counterReports: [],
          usageDataProvider: {
            harvestingDate: '2021-09-22T20:26:29.995390',
          },
          reportTitles: [],
          reportTitlesCount: 0,
        }}
        mutator={{
          query: {
            update: (newData) => Object.assign(queryData, newData),
          },
        }}
        reloadReportTitles={
          () => undefined
        }
      />
    </IntlProvider>
  );
};


describe('Matching Summary page', () => {
  let node;

  beforeEach(() => {
    node = renderMatchingSummary();
  });

  afterEach(cleanup);

  it('should be rendered', () => {
    const { container } = node;
    const content = container.querySelector('[data-test-matching-summary]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();
  });
});
