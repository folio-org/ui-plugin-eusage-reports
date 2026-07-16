// Chart.js plugin that draws each bar's value just above the top of the bar.
//
// It is shared by the Use Over Time and Cost Per Use charts. On mixed charts
// (e.g. Cost-per-use, which overlays a title-count line on top of the bars)
// only bar datasets are labelled; line datasets are skipped so their points
// are not stamped with numbers.
//
// A dataset may also carry an `inBarLabels` array, parallel to its `data`,
// whose entries are drawn inside the bars themselves, along the bottom.
// Cost-per-use uses this to show the use count a bar's cost was derived from
// alongside the cost. Keeping these down at the axis leaves clear air at the
// top of the bar, where the value label sits just outside.
//
// A bar shorter than this cannot hold a label legibly, so its in-bar label is
// dropped rather than drawn overflowing the bar.
const MIN_LABELLABLE_BAR_HEIGHT = 16;

const IN_BAR_LABEL_INSET = 3;

const barValueLabels = {
  id: 'barValueLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;
      if (meta.type === 'line') return;
      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        if (value === null || value === undefined) return;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '12px sans-serif';
        ctx.fillText(value, element.x, element.y - 2);
        ctx.restore();

        const inBarLabel = dataset.inBarLabels && dataset.inBarLabels[index];
        if (inBarLabel === null || inBarLabel === undefined) return;
        // NaN when the element has no base, e.g. in tests: skips the label.
        const barHeight = Math.abs(element.base - element.y);
        if (!(barHeight >= MIN_LABELLABLE_BAR_HEIGHT)) return;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '12px sans-serif';
        ctx.fillText(inBarLabel, element.x, element.base - IN_BAR_LABEL_INSET);
        ctx.restore();
      });
    });
  },
};


export default barValueLabels;
