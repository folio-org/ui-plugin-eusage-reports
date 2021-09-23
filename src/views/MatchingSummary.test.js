import React from 'react';
import { IntlProvider } from 'react-intl';
import { cleanup, render, screen } from '@testing-library/react';
import reportTitles from '../../test/jest/data/reportTitles';
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
          reportTitles,
          reportTitlesCount: 42,
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

    // Harvesting date and status
    expect(screen.getByText('9/22/2021')).toBeVisible(); // US formatting
    expect(screen.getByText('Pending review')).toBeVisible(); // Because some records are unmatched

    // Counts of records in various categories
    expect(screen.getByText('Records loaded')).toBeVisible();
    expect(screen.getByText('4 of 42')).toBeVisible();

    // Invoke match editor
    expect(screen.getByRole('button')).toHaveTextContent('Update matches');
    expect(screen.getByRole('button')).toBeEnabled();
  });
});
