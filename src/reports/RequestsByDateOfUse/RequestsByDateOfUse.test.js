import React from 'react';
import fetch from 'node-fetch';
import { cleanup, render, screen, fireEvent, act } from '@testing-library/react';
import withIntlConfiguration from '../../../test/jest/util/withIntlConfiguration';
import data from '../../../test/jest/data/reqs-by-date-of-use--input';
import RequestsByDateOfUse from './RequestsByDateOfUse';

jest.unmock('react-intl');
window.fetch = fetch;


const renderRequestsByDateOfUse = (hasLoaded) => {
  const url = 'https://thor-okapi.ci.folio.org/eusage-reports/stored-reports/reqs-by-date-of-use?accessCountPeriod=1Y&agreementId=a0416544-6027-4fac-97f7-547d34946db2&endDate=2021-10&includeOA=true&startDate=2019-10&yopInterval=5Y';

  return render(
    withIntlConfiguration(
      <RequestsByDateOfUse
        url={url}
        hasLoaded={hasLoaded}
        params={{
          countType: 'total',
        }}
        data={{ requestsByDateOfUse: data }}
        xCaption="Period of use"
        yCaption="Access count"
      />
    )
  );
};


describe('Requests-by-date-of-use report', () => {
  afterEach(cleanup);

  it('should not render the graph when not loaded', async () => {
    const node = renderRequestsByDateOfUse(false);
    const container = node.container;

    expect(container).toBeVisible();
    const graph = container.querySelector('canvas');
    expect(graph).toBeNull();
  });

  it('should render the graph when loaded', async () => {
    const node = renderRequestsByDateOfUse(true);
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
