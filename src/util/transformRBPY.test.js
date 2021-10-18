import RBPY from '../../test/jest/data/reqs-by-pub-year--input';
import RBPYoutTotal from '../../test/jest/data/reqs-by-pub-year--output-total';
import RBPYoutUnique from '../../test/jest/data/reqs-by-pub-year--output-unique';
import transformReqByPubYearData from './transformRBPY';

test('parses RBPY data to total-stats', () => {
  expect(transformReqByPubYearData(RBPY, 'Total_Item_Requests')).toStrictEqual(RBPYoutTotal);
});

test('parses RBPY data to unique-stats', () => {
  expect(transformReqByPubYearData(RBPY, 'Unique_Item_Requests')).toStrictEqual(RBPYoutUnique);
});
