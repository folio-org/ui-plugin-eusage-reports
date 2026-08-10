import React from 'react';
import { cleanup, render, screen, within } from '@folio/jest-config-stripes/testing-library/react';
import withIntlConfiguration from '../../../test/jest/util/withIntlConfiguration';
import data from '../../../test/jest/data/cost-per-use-report';
import CostPerUseTable from './CostPerUseTable';

jest.unmock('react-intl');


const renderTable = (cpu) => render(withIntlConfiguration(<CostPerUseTable cpu={cpu} />));

// The cells of one row, as text: the period, then cost/uses for total requests
// and cost/uses for unique requests.
const cellsOf = (row) => within(row).getAllByRole('cell').map(cell => cell.textContent);

const bodyRows = () => screen.getAllByRole('row').slice(2); // after the two header rows


describe('Cost-per-use table', () => {
  afterEach(cleanup);

  it('has a row for each reporting period, plus a total', () => {
    renderTable(data);

    // 3 periods in the fixture, and the total
    expect(bodyRows()).toHaveLength(4);
    expect(bodyRows().map(row => cellsOf(row)[0]))
      .toEqual(['2019', '2020', '2021', 'Total']);
  });

  it('shows the costs per use in the tenant currency, and the use counts beside them', () => {
    renderTable(data);

    // The 2020 period is the only one in the fixture with any usage
    expect(cellsOf(bodyRows()[1])).toEqual(['2020', '$17.86', '28', '$20.00', '25']);
  });

  // A period with no usage has nothing to divide the cost by, so the API sends
  // a null rather than a zero, and a rate of "$0.00" would be a lie.
  it('leaves the cost blank for a period with no usage', () => {
    renderTable(data);

    expect(cellsOf(bodyRows()[0])).toEqual(['2019', '', '0', '', '0']);
    expect(cellsOf(bodyRows()[2])).toEqual(['2021', '', '0', '', '0']);
  });

  // The total of a set of rates is meaningless, so only the counts are summed.
  it('totals the use counts and no more', () => {
    renderTable(data);

    expect(cellsOf(bodyRows()[3])).toEqual(['Total', '', '28', '', '25']);
  });

  it('sums the use counts across all periods', () => {
    renderTable({
      accessCountPeriods: ['2019', '2020'],
      totalItemRequestsByPeriod: [3, 4],
      uniqueItemRequestsByPeriod: [1, 2],
      totalItemCostsPerRequestsByPeriod: [10, 20],
      uniqueItemCostsPerRequestsByPeriod: [30, 40],
    });

    expect(cellsOf(bodyRows()[2])).toEqual(['Total', '', '7', '', '3']);
  });

  it('labels the two pairs of columns as total and unique requests', () => {
    renderTable(data);

    const [groupHeadings, columnHeadings] = screen.getAllByRole('row')
      .slice(0, 2)
      .map(row => within(row).getAllByRole('columnheader').map(cell => cell.textContent));

    // The period heading spans both rows, so it appears only in the first
    expect(groupHeadings).toEqual(['Reporting period', 'Total_Item_Requests', 'Unique_Item_Requests']);
    expect(columnHeadings).toEqual(['Cost per use', 'Uses', 'Cost per use', 'Uses']);
  });

  // The report is generated from whatever the API sent, and a report with no
  // data at all omits the arrays rather than sending empty ones.
  it('renders nothing but a zero total when the report is empty', () => {
    renderTable({});

    expect(bodyRows()).toHaveLength(1);
    expect(cellsOf(bodyRows()[0])).toEqual(['Total', '', '0', '', '0']);
  });

  it('copes with periods whose counts are missing', () => {
    renderTable({ accessCountPeriods: ['2019'] });

    expect(cellsOf(bodyRows()[0])).toEqual(['2019', '', '', '', '']);
    expect(cellsOf(bodyRows()[1])).toEqual(['Total', '', '0', '', '0']);
  });
});
