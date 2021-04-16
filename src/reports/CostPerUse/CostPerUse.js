import React, { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Bar } from 'react-chartjs-2';
import CostPerUseData from '../../../data/Cost per use - Viz.csv';
import compileCostPerUseData from './compileCostPerUseData';


const CostPerUse = () => {
  const intl = useIntl();
  const [agreementLineName, setAgreementLineName] = useState('');
  const compiledData = useMemo(() => compileCostPerUseData(CostPerUseData), []);
  const agreementLineData = compiledData[agreementLineName];

  const data = {
    labels: agreementLineData.labels,
    datasets: [
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.cpr-total' }),
        data: agreementLineData.total,
        backgroundColor: 'blue',
      },
      {
        label: intl.formatMessage({ id: 'ui-plugin-eusage-reports.costPerUse.cpr-unique' }),
        data: agreementLineData.unique,
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
      <p>
        <FormattedMessage id="ui-plugin-eusage-reports.costPerUse.select-agreement-line" />
        <select
          value={agreementLineName}
          onChange={(e) => setAgreementLineName(e.target.value)}
        >
          {Object.keys(compiledData).map(key => (
            <option key={key} value={key}>
              {key || '(All agreement lines)'}
            </option>
          ))}
        </select>
      </p>

      <Bar
        redraw
        data={data}
        options={options}
      />
    </>
  );
};


export default CostPerUse;
