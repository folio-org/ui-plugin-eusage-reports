import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import reportTitles from '../../test/jest/data/reportTitles';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import MatchEditor from './MatchEditor';

jest.unmock('react-intl');


const renderMatchEditor = () => {
  const queryData = { matchType: undefined };

  return render(withIntlConfiguration(
    <MatchEditor
      matchType="loaded"
      onClose={() => {}}
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
  ));
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

    // Counts of records in various categories
    expect(screen.getByText('Records loaded (4)')).toBeVisible();

    /*
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
