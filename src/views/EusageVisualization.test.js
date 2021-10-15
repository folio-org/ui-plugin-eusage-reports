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
    expect(report.value).toBe('uot'); // Use over time
    fireEvent.change(report, { target: { value: 'rbu' } });
    expect(report.value).toBe('rbu');

    const startMonthY = container.querySelector('#input-startDate-y');
    expect(startMonthY.value).toBe('2019');
    fireEvent.change(startMonthY, { target: { value: 2018 } });
    expect(startMonthY.value).toBe('2018');
  });
});
