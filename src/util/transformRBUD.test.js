import RBUD from '../../test/jest/data/reqs-by-date-of-use--input';
import RBUDoutTotal from '../../test/jest/data/reqs-by-date-of-use--output-total';
import RBUDoutUnique from '../../test/jest/data/reqs-by-date-of-use--output-unique';
import transformReqByUseDateData from './transformRBUD';

const intl = {
  formatMessage: () => 'nopub',
};

test('returns null for undefined RBUD', () => {
  expect(transformReqByUseDateData(undefined, 'Total_Item_Requests')).toStrictEqual(null);
});

test('parses RBUD data to total-stats', () => {
  expect(transformReqByUseDateData(intl, RBUD, 'Total_Item_Requests')).toStrictEqual(RBUDoutTotal);
});

test('parses RBUD data to unique-stats', () => {
  expect(transformReqByUseDateData(intl, RBUD, 'Unique_Item_Requests')).toStrictEqual(RBUDoutUnique);
});

test('fails to parse RBUD with bad metric-type', () => {
  /* eslint-disable no-console */
  const oldError = console.error;
  console.error = () => undefined;
  expect(transformReqByUseDateData(intl, RBUD, 'whatever')).toBe(null);
  console.error = oldError;
});
