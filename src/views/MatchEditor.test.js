import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { cleanup, render, screen, act, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOkapiKy, CalloutContext, Pluggable } from '@folio/stripes/core';
import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';
import generateTitleCategories from '../util/generateTitleCategories';
import reportTitles from '../../test/jest/data/reportTitles';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import MatchEditor from './MatchEditor';

jest.unmock('react-intl');


Pluggable.mockImplementation(props => {
  if (props.type !== 'find-eresource') throw new Error(`mocked Pluggable: unsupported type ${props.type}`);
  props.onEresourceSelected({
    id: '29168',
    name: 'Lost Tales special edition',
  });
  props.onClose();
  return (
    <>
      <h3>{props.modalLabel}</h3>
      {props.renderTrigger()}
    </>
  );
});


function okapiKy(path, options) {
  // console.log(`*** mocked okapiKy ${options.method} to ${path} with`, JSON.stringify(options, null, 2));
  const method = options.method;
  if (method !== 'POST') throw new Error(`mocked okapiKy: non-POST method ${method}`);
  const titles = options.json?.titles;
  if (!titles) throw new Error('mocked okapiKy: no titles in POSTed JSON');

  let ok = true;
  titles.forEach(newRec => {
    if (newRec.id === 'bad') {
      ok = false;
      return;
    }

    const rec = reportTitles.find(x => x.id === newRec.id);
    // console.log('found record', rec);
    Object.assign(rec, newRec);
    if (!newRec.kbTitleId) rec.kbTitleId = undefined;
    // console.log('record is now', rec);

    if (rec.kbManualMatch && !rec.kbTitleId) {
      // console.log('ignored record', rec.id);
    } else if (!rec.kbManualMatch && !rec.kbTitleId) {
      // console.log('unignored record', rec.id);
    } // else ...
  });

  return new Promise((resolve, reject) => {
    // console.log('*** mocked okapiKy resolving promise, ok =', ok);
    if (ok) {
      resolve({ status: 'ok' });
    } else {
      reject(new Error('bad ID'));
    }
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
    sendCallout: (calloutData) => {
      // console.log('*** calloutData =', calloutData);
      const translated = ReactDOMServer.renderToString(withIntlConfiguration(calloutData.message));
      const msgId = calloutData.message.props.id;
      if (msgId === 'ui-plugin-eusage-reports.action.ignored') {
        expect(translated).toMatch(/^Title <i>(Silmarillion|Lord of the Rings)<.i> will now be ignored$/);
      } else if (msgId === 'ui-plugin-eusage-reports.action.unignored') {
        expect(translated).toBe('Title <i>Silmarillion</i> will no longer be ignored');
      } else if (msgId === 'ui-plugin-eusage-reports.action.not-ignored') {
        expect(translated).toBe('It was not possible to ignore this title: Error: bad ID');
      } else if (msgId === 'ui-plugin-eusage-reports.action.edited') {
        expect(translated).toBe('Title <i>The Book of Lost Tales</i> now manually matched');
      } else {
        // eslint-disable-next-line no-console
        console.error('sendCallout with unexpected msgId', msgId);
      }
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

  it('should change a matched record to ignored', async () => {
    const rows = container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]');
    expect(rows.length).toEqual(4);
    const row = rows[0];
    expect(row).toBeInTheDocument();
    const actionButton = row.querySelector('button');
    expect(actionButton).toBeInTheDocument();

    expect(reportTitles[0].kbManualMatch).toBe(false);
    expect(reportTitles[0].kbTitleId).toBeDefined();

    // Ignore the first title
    userEvent.click(actionButton);
    const ignoreButton = getByText(row, 'Ignore');
    expect(ignoreButton).toBeVisible();
    await act(async () => {
      await userEvent.click(ignoreButton);
    });
    expect(reportTitles[0].kbManualMatch).toBe(true);
    expect(reportTitles[0].kbTitleId).toBeUndefined();

    // Unignore the first title
    userEvent.click(actionButton);
    const unIgnoreButton = getByText(row, 'Stop ignoring');
    expect(unIgnoreButton).toBeVisible();
    await act(async () => {
      await userEvent.click(unIgnoreButton);
    });
    expect(reportTitles[0].kbManualMatch).toBe(false);
  });

  it('should fail to ignore a record with bad ID', async () => {
    const rows = container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]');
    const row = rows[1];
    const actionButton = row.querySelector('button');

    // Try to ignore the second title, which okapiKy is rigged to fail
    userEvent.click(actionButton);
    const ignoreButton = getByText(row, 'Ignore');
    await act(async () => {
      await userEvent.click(ignoreButton);
    });
  });

  it('should change the match of a record', async () => {
    const rows = container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]');
    const row = rows[2];
    const actionButton = row.querySelector('button');

    // This record is initially unmatched
    expect(reportTitles[2].kbTitleName).toBeUndefined();
    expect(reportTitles[2].kbTitleId).toBeUndefined();

    // Edit the match for the second title
    userEvent.click(actionButton);
    const editButton = getByText(row, 'Edit');
    expect(editButton).toBeVisible();
    await act(async () => {
      // I have no idea why this generates a "Cannot update a
      // component while rendering a different component" error, but
      // it doesn't seem to prevent things from working.
      await userEvent.click(editButton);
    });

    expect(reportTitles[2].kbTitleName).toBe('Lost Tales special edition');
    expect(reportTitles[2].kbTitleId).toBe('29168');
  });
});
