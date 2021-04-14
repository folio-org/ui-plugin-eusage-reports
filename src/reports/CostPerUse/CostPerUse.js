import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import CostPerUseData from '../../../data/Cost per use - Viz.csv';
import compileCostPerUseData from './compile';


const CostPerUse = () => {
  const intl = useIntl();
  const cpuData = useMemo(() => compileCostPerUseData(CostPerUseData), []);

  const data = {
    labels: cpuData.labels,
    datasets: [
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.cpr-total' }),
        data: cpuData.total,
        backgroundColor: 'blue',
      },
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.cpr-unique' }),
        data: cpuData.unique,
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
        {JSON.stringify(cpuData, null, 2)}
      </pre>
    </>
  );
};


export default CostPerUse;
