import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { cleanup, render, screen, act, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOkapiKy, CalloutContext } from '@folio/stripes/core';
import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';
import generateTitleCategories from '../util/generateTitleCategories';
import reportTitles from '../../test/jest/data/reportTitles';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import MatchEditor from './MatchEditor';

jest.unmock('react-intl');

function okapiKy(_path, _options) {
  // console.log(`*** mocked okapiKy ${options.method} to`, path);
  return new Promise((resolve, _reject) => {
    // console.log('*** mocked okapiKy resolving promise');
    resolve({ status: 'ok' });
  });
}

// XXX we're not actually using any of these at this point
okapiKy.get = (path, options) => okapiKy(path, { method: 'GET', ...options });
okapiKy.post = (path, options) => okapiKy(path, { method: 'POST', ...options });
okapiKy.put = (path, options) => okapiKy(path, { method: 'PUT', ...options });
okapiKy.delete = (path, options) => okapiKy(path, { method: 'DELETE', ...options });


// Empirically, this has to be done at the top level, not within the test. No-one knows why
// See https://folio-project.slack.com/archives/C210UCHQ9/p1632425791183300?thread_ts=1632350696.158900&cid=C210UCHQ9
useOkapiKy.mockReturnValue(okapiKy);


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
  const callout = {
    sendCallout: (_calloutData) => {
      // console.log('*** sendCallout:', _calloutData.message.props.id);
    }
  };

  mockOffsetSize(500, 500); // See above
  return render(withIntlConfiguration(
    <CalloutContext.Provider value={callout}>
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
    </CalloutContext.Provider>
  ));
};


describe('Match Editor page', () => {
  let node;
  let container;

  beforeEach(() => {
    node = renderMatchEditor();
    container = node.container;
  });

  afterEach(cleanup);

  it('should be rendered', async () => {
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
    expect(container.querySelector('[data-test-match-editor]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]').length).toEqual(4);
  });

  function expectButtonToHaveClass(pattern, shouldBeIncluded, singleClass) {
    const matchedButton = screen.getByRole('button', { name: pattern });
    const classNames = matchedButton.className.split(' ');

    if (shouldBeIncluded) {
      expect(classNames).toContain(singleClass);
    } else {
      expect(classNames).not.toContain(singleClass);
    }
  }

  it('should switch between tabs', () => {
    expectButtonToHaveClass(/Records loaded/, true, 'primary');
    expectButtonToHaveClass(/Records loaded/, false, 'default');
    expectButtonToHaveClass(/Matched/, true, 'default');
    expectButtonToHaveClass(/Matched/, false, 'primary');

    act(() => {
      userEvent.click(screen.getByRole('button', { name: /Matched/ }));
    });

    // I don't know why we need a timeout, but we do. Wrapping in
    // act() doesn't suffice for the re-rendering updates to complete
    // before the next assertions happen.
    // See https://folio-project.slack.com/archives/C210UCHQ9/p1634201292315200
    setTimeout(() => {
      expectButtonToHaveClass(/Records loaded/, false, 'primary');
      expectButtonToHaveClass(/Records loaded/, true, 'default');
      expectButtonToHaveClass(/Matched/, false, 'default');
      expectButtonToHaveClass(/Matched/, true, 'primary');
    }, 0);
  });

  it('should change a matched record to ignored', () => {
    const rows = container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]');
    expect(rows.length).toEqual(4);
    const row = rows[0];
    expect(row).toBeInTheDocument();
    const actionButton = row.querySelector('button');
    expect(actionButton).toBeInTheDocument();

    userEvent.click(actionButton);
    const ignoreButton = getByText(row, 'Ignore');
    expect(ignoreButton).toBeVisible();

    // We're not ready to do this until we've mocked okapiKy
    act(() => {
      userEvent.click(ignoreButton);
    });
  });
});
