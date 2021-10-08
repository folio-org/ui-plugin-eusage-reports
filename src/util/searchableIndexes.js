// Value gets set into the `qindex` parameter of the UI URL, and used in the generated back-end query
const searchableIndexes = [
  { label: 'id', value: 'id' },
  { label: 'counterReportTitle', value: 'counterReportTitle' },
  { label: 'ISBN', value: 'isbn' },
  { label: 'printISSN', value: 'issn' },
  { label: 'onlineISSN', value: 'eissn' },
  { label: 'kbTitleId', value: 'kbTitleId' },
  { label: 'kbManualMatch', value: 'kbManualMatch' },
];

export default searchableIndexes;
