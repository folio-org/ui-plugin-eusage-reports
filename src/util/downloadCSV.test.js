import fetch from 'node-fetch';
import downloadCSV from './downloadCSV';

window.fetch = fetch;
jest.unmock('./downloadCSV');

const mockAnchorElement = {
  click: () => undefined,
  remove: () => undefined,
};

const mockDocument = {
  createElement: () => mockAnchorElement,
  body: {
    appendChild: () => undefined,
  },
};

let savedBlob;
const mockWindow = {
  URL: {
    createObjectURL: blob => { savedBlob = blob; },
  },
};

const mocks = {
  document: mockDocument,
  window: mockWindow,
};

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
fetch.mockResolvedValue(new Response('Mocked response content'));

test('should issue a download-CSV request', async () => {
  // document.createElement('a');
  const url = 'https://thor-okapi.ci.folio.org/eusage-reports/stored-reports/reqs-by-date-of-use?accessCountPeriod=1Y&agreementId=3b6623de-de39-4b43-abbc-998bed892025&endDate=2021-10&includeOA=true&startDate=2019-10&yopInterval=10Y&csv=true';
  const stripes = {
    okapi: {
      tenant: 'diku',
      token: '123abc'
    }
  };
  const params = {
    startDate: '2019-10',
    endDate: '2021-10'
  };

  expect(savedBlob).toBeUndefined();
  await downloadCSV(url, stripes, params, mocks);
  expect(savedBlob).toBeDefined();
  const text = await savedBlob.text();
  expect(text).toBe('Mocked response content');
});
