import React from 'react';
import { IntlProvider } from 'react-intl';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
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

  it('should be rendered', async () => {
    const { container } = node;
    const content = container.querySelector('[data-test-matching-summary]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Harvesting date and status
    // XXX See https://folio-project.slack.com/archives/C210UCHQ9/p1632414298168000?thread_ts=1632407596.164700&cid=C210UCHQ9
    expect(screen.getByText('9/22/2021')).toBeVisible(); // US formatting
    expect(screen.getByText('Pending review')).toBeVisible(); // Because some records are unmatched

    // Counts of records in various categories
    expect(screen.getByText('Records loaded')).toBeVisible();
    expect(screen.getByText('4 of 42')).toBeVisible();

    // Check and click update-matches button
    expect(screen.getByRole('button')).toHaveTextContent('Update matches');
    expect(screen.getByRole('button')).toBeEnabled();

    // See https://folio-project.slack.com/archives/C210UCHQ9/p1632425791183300?thread_ts=1632350696.158900&cid=C210UCHQ9
    useOkapiKy.mockImplementation(() => {
      console.log('*** in mocked useOkapiKy');
      return () => {
        console.log(' *** in mocked okapiKy');
        return {
          post: () => ({
            json: () => ({
              isLoading: false,
              expenseClasses: [{ id: 'id', name: 'name' }],
            }),
          }),
        };
      };
    });

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => screen.getByText('Requested update'));
  });
});
