function parseFacets(facets) {
  if (!facets) return undefined;
  const statusFacets = facets.filter(f => f.type === 'status');
  const values = statusFacets[0]?.facetValues || [];

  let totalCount = 0;
  const key2count = {};
  values.forEach(entry => {
    totalCount += entry.count;
    key2count[entry.value] = entry.count;
  });

  return [
    { key: 'loaded', count: totalCount },
    { key: 'matched', count: key2count.matched },
    { key: 'unmatched', count: key2count.unmatched },
    { key: 'ignored', count: key2count.ignored },
  ];
}

export default parseFacets;
