import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import EusageVisualization from './EusageVisualization';

jest.unmock('react-intl');

const renderEusageVisualization = () => {
  return render(withIntlConfiguration(
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
  });
});
