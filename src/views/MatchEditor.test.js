import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';
import generateTitleCategories from '../util/generateTitleCategories';
import reportTitles from '../../test/jest/data/reportTitles';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import MatchEditor from './MatchEditor';

jest.unmock('react-intl');
const queryData = { matchType: 'loaded' };


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
  const categories = generateTitleCategories(reportTitles);
  const history = createBrowserHistory();

  mockOffsetSize(500, 500); // See above
  return render(withIntlConfiguration(
    <Router history={history}>
      <MatchEditor
        matchType={queryData.matchType}
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
  it('should switch between tabs', async () => {
    renderMatchEditor();
    expect(await screen.findByText('matchType=loaded')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: /Matched/ }));
    expect(await screen.findByText('matchType=matched')).toBeVisible();
  });
});
