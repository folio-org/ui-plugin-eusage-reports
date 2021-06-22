function generateTitleCategories(records) {
  return [
    { key: 'loaded', data: records },
    { key: 'matched', data: records.filter(r => r.kbTitleId) },
    { key: 'unmatched', data: records.filter(r => !r.kbTitleId && !r.kbManualMatch) },
    { key: 'ignored', data: records.filter(r => !r.kbTitleId && r.kbManualMatch) },
  ];
}


export default generateTitleCategories;
