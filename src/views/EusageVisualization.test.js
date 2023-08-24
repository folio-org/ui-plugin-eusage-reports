import React from 'react';
import { cleanup, render, screen, act, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy, CalloutContext } from '@folio/stripes/core';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import EusageVisualization from './EusageVisualization';

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

const renderEusageVisualization = () => {
  const callout = { sendCallout: () => undefined };

  return render(withIntlConfiguration(
    <CalloutContext.Provider value={callout}>
      <EusageVisualization
        data={{
          reportStatus: {
            lastUpdated: '2021-09-30T19:04:25.608079'
          },
          agreement: {
            id: '12368',
            name: 'The Royal Society',
          }
        }}
        lastUpdatedHasLoaded
        reloadReportStatus={() => undefined}
      />
    </CalloutContext.Provider>
  ));
};


describe('eUsage visualization page', () => {
  let node;

  beforeEach(() => {
    node = renderEusageVisualization();
  });

  afterEach(cleanup);

  it('should be rendered', async () => {
    const { container } = node;
    expect(container).toBeVisible();

    const report = screen.getByLabelText('Report');
    expect(report.value).toBe('uot'); // Use over time (initial value)

    [
      // 'uot', // Use over time, no need to change to the current value
      'rbu', // Requests by date of use
      'rbp', // Requests by publication year
      'cpu', // Cost per use
    ].forEach(reportCode => {
      fireEvent.change(report, { target: { value: reportCode } });
      expect(report.value).toBe(reportCode);
    });

    const format = screen.getByLabelText('Format');
    expect(format.value).toBe('JOURNAL');
    fireEvent.change(format, { target: { value: 'BOOK' } });
    expect(format.value).toBe('BOOK');

    const includeOaYes = screen.getByLabelText('Yes');
    const includeOaNo = screen.getByLabelText('No');
    expect(includeOaYes.checked).toEqual(true);
    expect(includeOaNo.checked).toEqual(false);
    fireEvent.click(includeOaNo);
    expect(includeOaYes.checked).toEqual(false);
    expect(includeOaNo.checked).toEqual(true);
    fireEvent.click(includeOaYes);
    expect(includeOaYes.checked).toEqual(true);
    expect(includeOaNo.checked).toEqual(false);

    const startMonthY = container.querySelector('#input-startDate-y');
    // We can't rely on the start month's initial state, because it's based on the current date
    fireEvent.change(startMonthY, { target: { value: 2019 } });
    expect(startMonthY.value).toBe('2019');
    // Set an invalid value because it uses a differet code-path: gotta get that sweet coverage!
    // But there is no good way to observe the fact that it doesn't generate a new `startDate` value
    fireEvent.change(startMonthY, { target: { value: 201 } });
    expect(startMonthY.value).toBe('201');
    fireEvent.change(startMonthY, { target: { value: 2018 } });
    expect(startMonthY.value).toBe('2018');

    const startMonthM = container.querySelector('#input-startDate-m');
    // We can't rely on the start month's initial state, because it's based on the current date
    fireEvent.change(startMonthM, { target: { value: 10 } });
    expect(startMonthM.value).toBe('10');
    fireEvent.change(startMonthM, { target: { value: 11 } });
    expect(startMonthM.value).toBe('11');

    const endMonthY = container.querySelector('#input-endDate-y');
    // We can't rely on the end month's initial state, because it's based on the current date
    fireEvent.change(endMonthY, { target: { value: 2020 } });
    expect(endMonthY.value).toBe('2020');

    // Count-type and pickers are disabled for some reports, so switch to one that has them enabled
    fireEvent.change(report, { target: { value: 'rbu' } });
    const countTypeTotal = screen.getByLabelText('Total accesses');
    const countTypeUnique = screen.getByLabelText('Unique accesses');
    expect(countTypeTotal.checked).toEqual(true);
    expect(countTypeUnique.checked).toEqual(false);
    fireEvent.click(countTypeUnique);
    expect(countTypeTotal.checked).toEqual(false);
    expect(countTypeUnique.checked).toEqual(true);
    fireEvent.click(countTypeTotal);
    expect(countTypeTotal.checked).toEqual(true);
    expect(countTypeUnique.checked).toEqual(false);

    const leftPicker = screen.getByLabelText('Scale: Select interval for period of use');
    expect(leftPicker.value).toBe('1Y');
    fireEvent.change(leftPicker, { target: { value: '2Y' } });
    expect(leftPicker.value).toBe('2Y');

    const rightPicker = screen.getByLabelText('Stacks: Group publication year by');
    expect(rightPicker.value).toBe('5Y');
    fireEvent.change(rightPicker, { target: { value: '10Y' } });
    expect(rightPicker.value).toBe('10Y');

    // The secondary right-picker is enabled only for the "rbp" report
    fireEvent.change(report, { target: { value: 'rbp' } });
    const rightPicker2 = screen.getByLabelText('Stacks: Group period of use by');
    expect(rightPicker2.value).toBe('1Y');
    fireEvent.change(rightPicker2, { target: { value: '5Y' } });
    expect(rightPicker2.value).toBe('5Y');
  });

  it('should be able to analyse the agreement', async () => {
    const analyzeButton = screen.getByRole('button', { name: 'Analyze agreement' });
    expect(analyzeButton).toBeVisible();
    await act(async () => {
      fireEvent.click(analyzeButton);
    });
  });
});
