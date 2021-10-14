import generateTitleCategories from './generateTitleCategories';
import reportTitles from '../../test/jest/data/reportTitles';

test('generates title categories', () => {
  const cooked = generateTitleCategories(reportTitles);

  const sets = {};
  cooked.forEach(entry => {
    sets[entry.key] = entry.data;
  });

  expect(sets.loaded.length).toBe(4);
  expect(sets.matched.length).toBe(2);
  expect(sets.matched).toContain(reportTitles[0]);
  expect(sets.matched).toContain(reportTitles[1]);
  expect(sets.unmatched.length).toBe(1);
  expect(sets.unmatched[0].counterReportTitle).toBe('The Book of Lost Tales');
  expect(sets.ignored.length).toBe(1);
  expect(sets.ignored[0].counterReportTitle).toBe('The Hobbit');
});
