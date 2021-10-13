import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';
import generateTitleCategories from '../util/generateTitleCategories';
import reportTitles from '../../test/jest/data/reportTitles';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import MatchEditor from './MatchEditor';

jest.unmock('react-intl');


// By exhaustive and painful experiment, I have determined that when
// rendered by RTL, the actual content of a <MultiColumnList> is not
// included in the render if the "autosize" attribute is true.
//
// Apparently the standard way to deal with this is is to mock out the
// `offsetWidth` and `offsetHeight` which autoSize uses under the
// hood, and that is the magic that mockOffsetSize() provides.
//
// See the Slack thread at
// https://folio-project.slack.com/archives/C210UCHQ9/p1634060517309500?thread_ts=1634057810.308200&cid=C210UCHQ9
//
//
const renderMatchEditor = () => {
  const queryData = { matchType: undefined };
  const categories = generateTitleCategories(reportTitles);
  const history = createBrowserHistory();

  mockOffsetSize(500, 500); // See above
  return render(withIntlConfiguration(
    <Router history={history}>
      <MatchEditor
        matchType="loaded"
        onClose={() => {}}
        data={{
          usageDataProvider: {
            label: 'JSTOR',
          },
          categories: categories.map(({ key, data }) => ({ key, count: data.length })),
          reportTitles,
        }}
        mutator={{
          query: {
            update: (newData) => Object.assign(queryData, newData),
          },
        }}
        hasLoaded
        onNeedMoreData={() => undefined}
      />
    </Router>
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

  it('should contain actual content', async () => {
    expect(screen.getByText('The Silmarillion')).toBeVisible();
  });
});
