import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { useOkapiKy, CalloutContext } from '@folio/stripes/core';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import MatchingSummary from './MatchingSummary';

jest.unmock('react-intl');

// Empirically, this has to be done at the top level, not within the test. No-one knows why
// See https://folio-project.slack.com/archives/C210UCHQ9/p1632425791183300?thread_ts=1632350696.158900&cid=C210UCHQ9
useOkapiKy.mockReturnValue({
  post: (_path) => {
    // console.log('*** mocked okapiKy POST to', _path);
    return new Promise((resolve, _reject) => {
      // console.log('*** mocked okapiKy resolving promise');
      resolve({ status: 'ok' });
    });
  },
});


const queryData = { matchType: undefined };
const renderMatchingSummary = () => {
  const callout = {
    sendCallout: (_calloutData) => {
      // console.log('*** sendCallout:', _calloutData.message.props.id);
    }
  };

  return render(withIntlConfiguration(
    <CalloutContext.Provider value={callout}>
      <MatchingSummary
        hasLoaded
        data={{
          query: queryData,
          counterReports: [],
          usageDataProvider: {
            harvestingDate: '2021-09-22T20:26:29.995390',
          },
          categories: [
            { key: 'loaded', count: 4 },
            { key: 'matched', count: 2 },
            { key: 'unmatched', count: 1 },
            { key: 'ignored', count: 1 }
          ],
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
    </CalloutContext.Provider>
  ));
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
    expect(screen.getByText('Date of last harvest').nextElementSibling).toHaveTextContent('9/22/2021'); // US formatting
    expect(screen.getByText('Status').nextElementSibling).toHaveTextContent('Pending review'); // Some records are unmatched

    // Counts of records in various categories
    expect(screen.getByText('Records loaded').nextElementSibling).toHaveTextContent('4 of 42');
    expect(screen.getByText('Matched').nextElementSibling).toHaveTextContent('2');
    expect(screen.getByText('Unmatched').nextElementSibling).toHaveTextContent('1');
    expect(screen.getByText('Ignored').nextElementSibling).toHaveTextContent('1');

    // Check and click update-matches button
    expect(screen.getByRole('button')).toHaveTextContent('Update matches');
    expect(screen.getByRole('button')).toBeEnabled();

    fireEvent.click(screen.getByRole('button'));
    // XXX The callout mock renders nothing on screen for us to wait for
    // await waitFor(() => screen.getByText('Requested update'));
  });

  it('should link to various tabs of the match editor', () => {
    expect(queryData.matchType).toBeUndefined();

    const paramName2caption = {
      loaded: 'Records loaded',
      matched: 'Matched',
      unmatched: 'Unmatched',
      ignored: 'Ignored',
    };

    Object.keys(paramName2caption).forEach(paramName => {
      const caption = paramName2caption[paramName];
      fireEvent.click(screen.getByText(caption));
      expect(queryData.matchType).toBeDefined();
      expect(queryData.matchType).toBe(paramName);
    });
  });
});
