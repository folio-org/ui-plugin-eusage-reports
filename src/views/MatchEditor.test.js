import React from 'react';
import { IntlProvider } from 'react-intl';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { useOkapiKy, CalloutContext } from '@folio/stripes/core';
import reportTitles from '../../test/jest/data/reportTitles';
import MatchEditor from './MatchEditor';
import rawTranslations from '../../translations/ui-plugin-eusage-reports/en';

const translations = {};
Object.keys(rawTranslations).forEach(key => {
  translations[`ui-plugin-eusage-reports.${key}`] = rawTranslations[key];
});


// To skip the mock of stripes-components and use the real thing:
// jest.unmock('@folio/stripes/components');


const renderMatchEditor = () => {
  const queryData = { matchType: undefined };
  const callout = {
    sendCallout: (_calloutData) => {
      // console.log('*** sendCallout:', _calloutData.message.props.id);
    }
  };

  return render(
    <CalloutContext.Provider value={callout}>
      <IntlProvider locale="en-US" messages={translations}>
        <MatchEditor
          matchType="loaded"
          onClose={() => console.log('*** onClose')}
          data={{
            usageDataProvider: {
              label: 'JSTOR',
            },
            reportTitles,
          }}
          mutator={{
            query: {
              update: (newData) => Object.assign(queryData, newData),
            },
          }}
        />
      </IntlProvider>
    </CalloutContext.Provider>
  );
};


describe('Match Editor page', () => {
  let node;

  beforeEach(() => {
    node = renderMatchEditor();
  });

  afterEach(cleanup);

  it('should be rendered', async () => {
    const { container } = node;
    const content = container.querySelector('[data-test-match-editor]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    /*
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
    */
  });
});
