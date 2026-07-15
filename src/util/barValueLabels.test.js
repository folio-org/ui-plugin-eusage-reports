import barValueLabels from './barValueLabels';


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
  // where each entry is { data, hidden, type, points } and `points` gives the
  // {x,y} pixel position of each bar element.
  function makeChart(ctx, datasets) {
    return {
      ctx,
      data: {
        datasets: datasets.map(d => ({ data: d.data })),
      },
      getDatasetMeta: (i) => ({
        hidden: datasets[i].hidden || false,
        type: datasets[i].type,
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

  it('skips line datasets so only bars are labelled', () => {
    const ctx = makeCtx();
    const chart = makeChart(ctx, [
      { type: 'line', data: [99], points: [{ x: 100, y: 50 }] },
      { data: [20], points: [{ x: 120, y: 200 }] },
    ]);

    barValueLabels.afterDatasetsDraw(chart);

    expect(ctx.calls.map(c => c.text)).toEqual([20]);
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
