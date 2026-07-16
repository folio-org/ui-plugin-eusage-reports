import React from 'react';
import fetch from 'node-fetch';
import { createIntl } from 'react-intl';
import { cleanup, render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import withIntlConfiguration from '../../../test/jest/util/withIntlConfiguration';
import data from '../../../test/jest/data/cost-per-use-report';
import CostPerUse, { usesPerItemCaption } from './CostPerUse';

jest.unmock('react-intl');
window.fetch = fetch;


const renderCostPerUse = (hasLoaded) => {
  const url = 'https://thor-okapi.ci.folio.org/eusage-reports/stored-reports/cost-per-use?accessCountPeriod=1Y&agreementId=a0416544-6027-4fac-97f7-547d34946db2&endDate=2021-10&format=JOURNAL&includeOA=true&startDate=2019-10';
  return render(
    withIntlConfiguration(
      <CostPerUse
        url={url}
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


// The caption's wording is translators' business and changes freely, so these
// tests pin a stub message of their own: what matters here is which values are
// worked out and handed to it, not the English it ends up wrapped in.
const CAPTION_STUB = 'avg={average} total={total} unique={unique}';

const stubIntl = createIntl({
  locale: 'en-US',
  messages: { 'ui-plugin-eusage-reports.costPerUse.usesPerItem': CAPTION_STUB },
});

const captionFor = (total, unique) => usesPerItemCaption(stubIntl, {
  totalItemRequestsByPeriod: [total],
  uniqueItemRequestsByPeriod: [unique],
}, 0);


describe('uses-per-item caption', () => {
  it('averages the total uses over the number of items used', () => {
    expect(captionFor(9, 2)).toEqual('avg=4.5 total=9 unique=2');
  });

  it('rounds a recurring average to two decimal places', () => {
    expect(captionFor(28, 25)).toEqual('avg=1.12 total=28 unique=25');
    expect(captionFor(10, 3)).toEqual('avg=3.33 total=10 unique=3');
  });

  // The message pluralises on the average, so a value that only rounds to 1
  // must reach it as 1: otherwise English reads "1 uses per item".
  it('rounds an average to a whole number when that is what it comes to', () => {
    expect(captionFor(1000, 999)).toEqual('avg=1 total=1000 unique=999');
  });

  it('has nothing to say about a period with no usage', () => {
    expect(captionFor(0, 0)).toBeUndefined();
  });

  it('has nothing to say when the counts are missing altogether', () => {
    expect(usesPerItemCaption(stubIntl, {}, 0)).toBeUndefined();
  });
});


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

    // I don't know why this function needs to be mocked, but it does
    window.URL.createObjectURL = () => undefined;

    // Just checking we can click the download-CSV button; actual testing for this is elsewhere
    fireEvent.click(screen.getByRole('button'));
  });
});
