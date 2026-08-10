import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import css from './CostPerUseTable.css';


// A cost per use is a rate, blank when the period had no usage to divide by; a
// use count is a plain integer. Rendering helpers keep the body rows readable.
// The amounts are already in the tenant's system currency, so we format them
// with its symbol in a locale-appropriate way.
function Cost({ value, currency }) {
  if (value === null || value === undefined) return null;
  return <FormattedNumber value={value} style="currency" currency={currency} />;
}

Cost.propTypes = {
  value: PropTypes.number,
  currency: PropTypes.string,
};

function sum(list) {
  return (list || []).reduce((acc, x) => acc + (x || 0), 0);
}


function CostPerUseTable({ cpu }) {
  const stripes = useStripes();
  const { currency } = stripes;
  const periods = cpu.accessCountPeriods || [];

  return (
    <table className={css.table}>
      <thead>
        <tr>
          <th><FormattedMessage id="ui-plugin-eusage-reports.costPerUse.table.reporting-period" /></th>
          <th colSpan={2} className={css.totalGroup}><FormattedMessage id="ui-plugin-eusage-reports.useOverTime.metric.Total_Item_Requests" /></th>
          <th colSpan={2} className={css.uniqueGroup}><FormattedMessage id="ui-plugin-eusage-reports.useOverTime.metric.Unique_Item_Requests" /></th>
        </tr>
        <tr>
          <th />
          <th><FormattedMessage id="ui-plugin-eusage-reports.report-form.report.cost-per-use" /></th>
          <th><FormattedMessage id="ui-plugin-eusage-reports.costPerUse.table.uses" /></th>
          <th><FormattedMessage id="ui-plugin-eusage-reports.report-form.report.cost-per-use" /></th>
          <th><FormattedMessage id="ui-plugin-eusage-reports.costPerUse.table.uses" /></th>
        </tr>
      </thead>
      <tbody>
        {
          periods.map((period, i) => (
            <tr key={period}>
              <td>{period}</td>
              <td className={`${css.numeric} ${css.totalGroup}`}><Cost value={cpu.totalItemCostsPerRequestsByPeriod?.[i]} currency={currency} /></td>
              <td className={`${css.numeric} ${css.totalGroup}`}>{cpu.totalItemRequestsByPeriod?.[i]}</td>
              <td className={`${css.numeric} ${css.uniqueGroup}`}><Cost value={cpu.uniqueItemCostsPerRequestsByPeriod?.[i]} currency={currency} /></td>
              <td className={`${css.numeric} ${css.uniqueGroup}`}>{cpu.uniqueItemRequestsByPeriod?.[i]}</td>
            </tr>
          ))
        }
        <tr className={css.total}>
          <td><FormattedMessage id="ui-plugin-eusage-reports.costPerUse.table.total" /></td>
          <td />
          <td className={css.numeric}>{sum(cpu.totalItemRequestsByPeriod)}</td>
          <td />
          <td className={css.numeric}>{sum(cpu.uniqueItemRequestsByPeriod)}</td>
        </tr>
      </tbody>
    </table>
  );
}


CostPerUseTable.propTypes = {
  cpu: PropTypes.shape({
    accessCountPeriods: PropTypes.arrayOf(PropTypes.string),
    totalItemRequestsByPeriod: PropTypes.arrayOf(PropTypes.number),
    uniqueItemRequestsByPeriod: PropTypes.arrayOf(PropTypes.number),
    totalItemCostsPerRequestsByPeriod: PropTypes.arrayOf(PropTypes.number),
    uniqueItemCostsPerRequestsByPeriod: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};


export default CostPerUseTable;
