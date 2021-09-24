import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
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
    expect(screen.getByText('Matched (2)')).toBeVisible();
    expect(screen.getByText('Unmatched (1)')).toBeVisible();
    expect(screen.getByText('Ignored (1)')).toBeVisible();
  });
});
