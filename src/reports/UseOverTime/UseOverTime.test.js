import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { useStripes } from '@folio/stripes/core';
import withIntlConfiguration from '../../../test/jest/util/withIntlConfiguration';
import data from '../../../test/jest/data/use-over-time-report';
import UseOverTime from './UseOverTime';

jest.unmock('react-intl');
window.fetch = fetch;


function UseOverTimeWrapper(props) {
  const stripes = useStripes();
  const { showDevInfo, ...rest } = props;
  if (showDevInfo) {
    stripes.config.showDevInfo = true;
  }

  return <UseOverTime {...rest} />;
}
UseOverTimeWrapper.propTypes = { showDevInfo: PropTypes.bool };


const renderUseOverTime = (hasLoaded, showDevInfo) => {
  const url = 'https://thor-okapi.ci.folio.org/eusage-reports/stored-reports/use-over-time?accessCountPeriod=1Y&agreementId=a0416544-6027-4fac-97f7-547d34946db2&endDate=2021-10&format=JOURNAL&includeOA=true&startDate=2019-10';

  return render(
    withIntlConfiguration(
      <UseOverTimeWrapper
        url={url}
        hasLoaded={hasLoaded}
        params={{
          format: 'whatever',
          includeOA: true,
          startDate: "doesn't matter",
          endDate: "doesn't matter",
        }}
        data={{ useOverTime: data }}
        xCaption="Period of use"
        yCaption="Access count"
        showDevInfo={showDevInfo}
      />
    )
  );
};


describe('Use-over-time report', () => {
  afterEach(cleanup);

  it('should not render the graph when not loaded', async () => {
    const node = renderUseOverTime(false, false);
    const container = node.container;

    expect(container).toBeVisible();
    const graph = container.querySelector('canvas');
    expect(graph).toBeNull();
  });

  it('should render the graph when loaded but not the devInfo', async () => {
    const node = renderUseOverTime(true, false);
    const container = node.container;

    expect(container).toBeVisible();
    const graph = container.querySelector('canvas');
    expect(graph).toBeVisible();
    // Beyond here, it's difficult to test rendering, as what we get
    // is a PNG with embedded text. Short of OCRing it, we're stuck.

    const tfHeading = screen.queryByText('Tabular form');
    expect(tfHeading).toBeNull();

    // I don't know why this function needs to be mocked, but it does
    window.URL.createObjectURL = () => undefined;

    // Just checking we can click the download-CSV button; actual testing for this is elsewhere
    fireEvent.click(screen.getByRole('button'));
  });

  it('should render the devInfo when setting is true', async () => {
    const node = renderUseOverTime(true, true);
    const container = node.container;

    expect(container).toBeVisible();

    const tfHeading = screen.queryByText('Tabular form');
    expect(tfHeading).toBeVisible();

    const textNode = screen.getByText('Unique item requests across period');
    expect(textNode).toBeVisible();
    // XXX This doesn't work: I can't figure how to traverse the DOM
    // expect(textNode.parentNode().nextSibling().toBeVisible();

    // There is probably a clever way to assert that there are in the same table row
    expect(screen.getByText('Totals - Total item requests')).toBeVisible();
    expect(screen.getByText('185')).toBeVisible();
    expect(screen.getByText('74')).toBeVisible();
  });
});
