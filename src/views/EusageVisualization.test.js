import React from 'react';
import { cleanup, render } from '@testing-library/react';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import EusageVisualization from './EusageVisualization';

jest.unmock('react-intl');

const renderEusageVisualization = () => {
  const queryData = { matchType: undefined };

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
  });
});
