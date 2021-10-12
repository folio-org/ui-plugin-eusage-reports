export default [
  // automatically matched
  {
    counterReportTitle: 'Silmarillion',
    kbTitleId: '123',
    kbTitleName: 'The Silmarillion',
    kbManualMatch: false,
  },

  // manually matched
  {
    counterReportTitle: 'Lord of the Ring',
    kbTitleId: '456',
    kbTitleName: 'The Lord of the Rings',
    kbManualMatch: true,
  },

  // unmatched
  {
    counterReportTitle: 'The Book of Lost Tales',
    kbTitleId: undefined,
    kbTitleName: undefined,
    kbManualMatch: false,
  },

  // ignored
  {
    counterReportTitle: 'The Hobbit',
    kbTitleId: undefined,
    kbTitleName: undefined,
    kbManualMatch: true,
  },
];
