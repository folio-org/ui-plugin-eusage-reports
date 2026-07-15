// Chart.js plugin that draws each bar's value just above the top of the bar.
//
// It is shared by the Use Over Time and Cost Per Use charts. On mixed charts
// (e.g. Cost-per-use, which overlays a title-count line on top of the bars)
// only bar datasets are labelled; line datasets are skipped so their points
// are not stamped with numbers.
//
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
      });
    });
  },
};


export default barValueLabels;
