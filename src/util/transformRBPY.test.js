import RBPY from '../../test/jest/data/reqs-by-pub-year--input';
import RBPYoutTotal from '../../test/jest/data/reqs-by-pub-year--output-total';
import RBPYoutUnique from '../../test/jest/data/reqs-by-pub-year--output-unique';
import transformReqByPubYearData from './transformRBPY';

test('returns null for undefined RBPY', () => {
  expect(transformReqByPubYearData(undefined, 'Total_Item_Requests')).toStrictEqual(null);
});

test('parses RBPY data to total-stats', () => {
  expect(transformReqByPubYearData(RBPY, 'Total_Item_Requests')).toStrictEqual(RBPYoutTotal);
});

test('parses RBPY data to unique-stats', () => {
  expect(transformReqByPubYearData(RBPY, 'Unique_Item_Requests')).toStrictEqual(RBPYoutUnique);
});

test('fails to parses RBPY with bad metric-type', () => {
  /* eslint-disable no-console */
  const oldError = console.error;
  console.error = () => undefined;
  expect(transformReqByPubYearData(RBPY, 'whatever')).toBe(null);
  console.error = oldError;
});
