import React, { useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { cleanup, render, screen, getByText } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy, CalloutContext, Pluggable } from '@folio/stripes/core';
import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';
import generateTitleCategories from '../util/generateTitleCategories';
import reportTitles from '../../test/jest/data/reportTitles';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import MatchEditor from './MatchEditor';

jest.unmock('react-intl');


Pluggable.mockImplementation(props => {
  useEffect(() => {
    if (props.type !== 'find-eresource') throw new Error(`mocked Pluggable: unsupported type ${props.type}`);
    props.onEresourceSelected({
      id: '29168',
      name: 'Lost Tales special edition',
    });
    props.onClose();
  });

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
const queryMutatorMock = jest.fn();

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
const renderMatchEditor = (matchType) => {
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
          matchType={matchType}
          onClose={() => {}}
          data={{
            usageDataProvider: {
              label: 'JSTOR',
            },
            categories: categories.map(({ key, data }) => ({ key, count: data.length })),
            reportTitles: [...reportTitles],
          }}
          mutator={{
            query: {
              update: queryMutatorMock,
            },
          }}
          hasLoaded
          onNeedMoreData={() => undefined}
        />
      </Router>
    </CalloutContext.Provider>
  ));
};


describe('Match Editor page matchType=\'loaded\'', () => {
  let node;
  let container;

  beforeEach(() => {
    node = renderMatchEditor('loaded');
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

    expect(screen.getByRole('button', { name: /Records loaded/ })).toHaveClass('primary');
    expect(screen.getByRole('button', { name: /Matched/ })).toHaveClass('default');
  });

  it('should contain actual content', async () => {
    expect(screen.getByText('The Silmarillion')).toBeVisible();
    expect(container.querySelector('[data-test-match-editor]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]').length).toEqual(4);
  });

  it('switching tabs should call query mutator', async () => {
    await userEvent.click(screen.getByRole('button', { name: /Matched/ }));
    expect(queryMutatorMock).toHaveBeenCalledWith({ matchType: 'matched' });

    await userEvent.click(screen.getByRole('button', { name: /Ignored/ }));
    expect(queryMutatorMock).toHaveBeenCalledWith({ matchType: 'ignored' });
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
    await userEvent.click(actionButton);
    const ignoreButton = getByText(row, 'Ignore');
    expect(ignoreButton).toBeVisible();
    await userEvent.click(ignoreButton);
    expect(reportTitles[0].kbManualMatch).toBe(true);
    expect(reportTitles[0].kbTitleId).toBeUndefined();

    // Unignore the first title
    await userEvent.click(actionButton);
    const unIgnoreButton = getByText(row, 'Stop ignoring');
    expect(unIgnoreButton).toBeVisible();
    await userEvent.click(unIgnoreButton);
    expect(reportTitles[0].kbManualMatch).toBe(false);
  });

  it('should fail to ignore a record with bad ID', async () => {
    const rows = container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]');
    const row = rows[1];
    const actionButton = row.querySelector('button');

    // Try to ignore the second title, which okapiKy is rigged to fail
    await userEvent.click(actionButton);
    const ignoreButton = getByText(row, 'Ignore');
    await userEvent.click(ignoreButton);
  });

  it('should change the match of a record', async () => {
    const rows = container.querySelectorAll('[data-test-match-editor] .mclRowContainer > [role=row]');
    const row = rows[2];
    const actionButton = row.querySelector('button');

    // This record is initially unmatched
    expect(reportTitles[2].kbTitleName).toBeUndefined();
    expect(reportTitles[2].kbTitleId).toBeUndefined();

    // Edit the match for the second title
    await userEvent.click(actionButton);
    const editButton = getByText(row, 'Edit');
    expect(editButton).toBeVisible();
    await userEvent.click(editButton);

    expect(reportTitles[2].kbTitleName).toBe('Lost Tales special edition');
    expect(reportTitles[2].kbTitleId).toBe('29168');
  });
});

describe('Match Editor page matchType=\'matched\'', () => {
  let node;
  let container;

  beforeEach(() => {
    node = renderMatchEditor('matched');
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

    expect(screen.getByRole('button', { name: /Records loaded/ })).toHaveClass('default');
    expect(screen.getByRole('button', { name: /Matched/ })).toHaveClass('primary');
  });
});
