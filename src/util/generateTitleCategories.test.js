import generateTitleCategories from './generateTitleCategories';

const raw = [
  { counterReportTitle: 'Sil', kbTitleId: 'The Silmarillion', kbManualMatch: false }, // automatically matched
  { counterReportTitle: 'LotR', kbTitleId: 'The Lord of the Rings', kbManualMatch: true }, // manually matched
  { counterReportTitle: 'BoLT', kbTitleId: undefined, kbManualMatch: false }, // unmatched
  { counterReportTitle: 'Hob', kbTitleId: undefined, kbManualMatch: true }, // ignored
];

test('generates title categories', () => {
  const cooked = generateTitleCategories(raw);

  const sets = {};
  cooked.forEach(entry => {
    sets[entry.key] = entry.data;
  });

  expect(sets.loaded.length).toBe(4);
  expect(sets.matched.length).toBe(2);
  expect(sets.matched).toContain(raw[0]);
  expect(sets.matched).toContain(raw[1]);
  expect(sets.unmatched.length).toBe(1);
  expect(sets.unmatched[0].counterReportTitle).toBe('BoLT');
  expect(sets.ignored.length).toBe(1);
  expect(sets.ignored[0].counterReportTitle).toBe('Hob');
});
