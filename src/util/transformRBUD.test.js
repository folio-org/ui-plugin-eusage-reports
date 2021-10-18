import RBUD from '../../test/jest/data/reqs-by-date-of-use--input';
import RBUDoutTotal from '../../test/jest/data/reqs-by-date-of-use--output-total';
import RBUDoutUnique from '../../test/jest/data/reqs-by-date-of-use--output-unique';
import transformReqByPubYearData from './transformRBUD';

const intl = {
  formatMessage: () => 'nopub',
};

test('parses RBUD data to total-stats', () => {
  expect(transformReqByPubYearData(intl, RBUD, 'Total_Item_Requests')).toStrictEqual(RBUDoutTotal);
});

test('parses RBUD data to unique-stats', () => {
  expect(transformReqByPubYearData(intl, RBUD, 'Unique_Item_Requests')).toStrictEqual(RBUDoutUnique);
});
