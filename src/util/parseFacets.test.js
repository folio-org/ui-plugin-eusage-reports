import parseFacets from './parseFacets';

/* eslint-disable quotes */
const facets = [
  {
    "type": "status",
    "facetValues": [
      {
        "value": "matched",
        "count": 97
      },
      {
        "value": "unmatched",
        "count": 272
      },
      {
        "value": "ignored",
        "count": 0
      }
    ]
  }
];

const expected = [
  { key: 'loaded', count: 369 },
  { key: 'matched', count: 97 },
  { key: 'unmatched', count: 272 },
  { key: 'ignored', count: 0 }
];

test('parses null facets', () => {
  expect(parseFacets(undefined)).toBe(undefined);
});

test('parses empty facets', () => {
  const res = parseFacets([{ type: 'foobar' }]);
  expect(res).toBeDefined();
  expect(res.length).toBe(4);
  res.forEach((entry, i) => {
    expect(entry.count).toBe(i === 0 ? 0 : undefined);
  });
});

test('parses good facets', () => {
  const res = parseFacets(facets);
  expect(res).toBeDefined();
  expect(res.length).toBe(4);

  res.forEach((entry, i) => {
    expect(res[i].key).toBe(expected[i].key);
    expect(res[i].count).toBe(expected[i].count);
  });
});

