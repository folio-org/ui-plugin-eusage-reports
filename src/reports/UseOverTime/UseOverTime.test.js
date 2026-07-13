import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'node-fetch';
import { cleanup, render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import withIntlConfiguration from '../../../test/jest/util/withIntlConfiguration';
import data from '../../../test/jest/data/use-over-time-report';
import UseOverTime, { barValueLabels, seriesForMetricType } from './UseOverTime';

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
    expect(screen.queryByText('Tabular form')).toBeVisible();
    expect(screen.getByText((_, e) => e.textContent === 'Unique item requests across period: 201')).toBeVisible();
    expect(screen.getByText((_, e) => e.textContent === 'Total item requests across period: 259')).toBeVisible();

    // There is probably a clever way to assert that there are in the same table row
    expect(screen.getByText('Totals - Total item requests')).toBeVisible();
    expect(screen.getByText('185')).toBeVisible();
    expect(screen.getByText('74')).toBeVisible();
  });
});


describe('seriesForMetricType', () => {
  it('uses the pre-computed top-level totals for the two request metric types', () => {
    expect(seriesForMetricType(data, 'Total_Item_Requests')).toEqual(data.totalItemRequestsByPeriod);
    expect(seriesForMetricType(data, 'Unique_Item_Requests')).toEqual(data.uniqueItemRequestsByPeriod);
  });

  it('returns null for a metric type not present in the report', () => {
    expect(seriesForMetricType(data, 'Searches_Regular')).toBeNull();
  });

  it('aggregates by-period counts across all items sharing a metric type', () => {
    const uot = {
      accessCountPeriods: ['2019', '2020', '2021'],
      items: [
        { metricType: 'Total_Item_Investigations', accessCountsByPeriod: [1, 2, 3] },
        { metricType: 'Unique_Item_Requests', accessCountsByPeriod: [99, 99, 99] },
        { metricType: 'Total_Item_Investigations', accessCountsByPeriod: [10, 20, 30] },
      ],
    };

    expect(seriesForMetricType(uot, 'Total_Item_Investigations')).toEqual([11, 22, 33]);
  });

  it('treats missing per-period entries as zero', () => {
    const uot = {
      accessCountPeriods: ['2019', '2020', '2021'],
      items: [
        { metricType: 'Searches_Regular', accessCountsByPeriod: [5] },
      ],
    };

    expect(seriesForMetricType(uot, 'Searches_Regular')).toEqual([5, 0, 0]);
  });
});


describe('barValueLabels chart plugin', () => {
  // A fake canvas context that records every fillText call, plus the fillStyle
  // and alignment in force at the time of the call.
  function makeCtx() {
    const ctx = {
      fillStyle: undefined,
      textAlign: undefined,
      textBaseline: undefined,
      font: undefined,
      calls: [],
      save: () => {},
      restore: () => {},
      fillText: function fillText(text, x, y) {
        this.calls.push({
          text,
          x,
          y,
          fillStyle: this.fillStyle,
          textAlign: this.textAlign,
          textBaseline: this.textBaseline,
        });
      },
    };
    return ctx;
  }

  // Builds a minimal Chart.js-like object: one dataset per entry in `datasets`,
  // where each entry is { data, hidden, points } and `points` gives the {x,y}
  // pixel position of each bar element.
  function makeChart(ctx, datasets) {
    return {
      ctx,
      data: {
        datasets: datasets.map(d => ({ data: d.data })),
      },
      getDatasetMeta: (i) => ({
        hidden: datasets[i].hidden || false,
        data: datasets[i].points,
      }),
    };
  }

  it('draws each bar value in black, centred just above the bar top', () => {
    const ctx = makeCtx();
    const chart = makeChart(ctx, [
      { data: [10, 20], points: [{ x: 100, y: 300 }, { x: 200, y: 150 }] },
    ]);

    barValueLabels.afterDatasetsDraw(chart);

    expect(ctx.calls).toEqual([
      { text: 10, x: 100, y: 298, fillStyle: 'black', textAlign: 'center', textBaseline: 'bottom' },
      { text: 20, x: 200, y: 148, fillStyle: 'black', textAlign: 'center', textBaseline: 'bottom' },
    ]);
  });

  it('labels every dataset in a grouped chart', () => {
    const ctx = makeCtx();
    const chart = makeChart(ctx, [
      { data: [10], points: [{ x: 100, y: 300 }] },
      { data: [20], points: [{ x: 120, y: 200 }] },
    ]);

    barValueLabels.afterDatasetsDraw(chart);

    expect(ctx.calls.map(c => c.text)).toEqual([10, 20]);
  });

  it('skips hidden datasets', () => {
    const ctx = makeCtx();
    const chart = makeChart(ctx, [
      { data: [10], points: [{ x: 100, y: 300 }] },
      { data: [20], points: [{ x: 120, y: 200 }], hidden: true },
    ]);

    barValueLabels.afterDatasetsDraw(chart);

    expect(ctx.calls.map(c => c.text)).toEqual([10]);
  });

  it('skips null and undefined values', () => {
    const ctx = makeCtx();
    const chart = makeChart(ctx, [
      {
        data: [10, null, undefined, 40],
        points: [
          { x: 100, y: 300 },
          { x: 200, y: 0 },
          { x: 300, y: 0 },
          { x: 400, y: 100 },
        ],
      },
    ]);

    barValueLabels.afterDatasetsDraw(chart);

    expect(ctx.calls.map(c => c.text)).toEqual([10, 40]);
  });

  it('draws a zero value rather than skipping it', () => {
    const ctx = makeCtx();
    const chart = makeChart(ctx, [
      { data: [0], points: [{ x: 100, y: 400 }] },
    ]);

    barValueLabels.afterDatasetsDraw(chart);

    expect(ctx.calls.map(c => c.text)).toEqual([0]);
  });
});
