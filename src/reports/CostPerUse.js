import CostPerUseUseData from '../../data/Cost per use - Viz.csv';

export default () => (
  <pre>
    {JSON.stringify(CostPerUseUseData, null, 2)}
  </pre>
);
