import React from 'react';
import fetch from 'node-fetch';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import withIntlConfiguration from '../../../test/jest/util/withIntlConfiguration';
import data from '../../../test/jest/data/cost-per-use-report';
import CostPerUse from './CostPerUse';

jest.unmock('react-intl');
window.fetch = fetch;


const renderCostPerUse = (hasLoaded) => {
  return render(
    withIntlConfiguration(
      <CostPerUse
        url="not used in this test"
        hasLoaded={hasLoaded}
        params={{
          format: 'whatever',
          includeOA: true,
          startDate: "doesn't matter",
          endDate: "doesn't matter",
        }}
        data={{ costPerUse: data }}
        xCaption="Period of use"
        yCaption="Cost, converted to system currency"
      />
    )
  );
};


describe('Cost-per-use report', () => {
  afterEach(cleanup);

  it('should not render the graph when not loaded', async () => {
    const node = renderCostPerUse(false);
    const container = node.container;

    expect(container).toBeVisible();
    const graph = container.querySelector('canvas');
    expect(graph).toBeNull();
  });

  it('should render the graph when loaded', async () => {
    const node = renderCostPerUse(true);
    const container = node.container;

    expect(container).toBeVisible();
    const graph = container.querySelector('canvas');
    expect(graph).toBeVisible();
    // Beyond here, it's difficult to test rendering, as what we get
    // is a PNG with embedded text. Short of OCRing it, we're stuck.

    // Just checking we can click the download-CSV button; actual testing for this is elsewhere
    fireEvent.click(screen.getByRole('button'));
  });
});
