import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import CostPerUseData from '../../../data/Cost per use - Viz.csv';
import compileCostPerUseData from './compileCostPerUseData';


const CostPerUse = () => {
  const intl = useIntl();
  const compiledData = useMemo(() => compileCostPerUseData(CostPerUseData), []);
  const allLinesData = compiledData[''];

  const data = {
    labels: allLinesData.labels,
    datasets: [
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.cpr-total' }),
        data: allLinesData.total,
        backgroundColor: 'blue',
      },
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.cpr-unique' }),
        data: allLinesData.unique,
        backgroundColor: 'red',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      <Bar
        redraw
        data={data}
        options={options}
      />
      <pre>
        {JSON.stringify(compiledData, null, 2)}
      </pre>
    </>
  );
};


export default CostPerUse;
