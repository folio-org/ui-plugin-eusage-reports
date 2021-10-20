import fetch from 'node-fetch';
import { useOkapiKy } from '@folio/stripes/core';
import downloadCSV from './downloadCSV';

window.fetch = fetch;

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

useOkapiKy.mockReturnValue({
  post: (_path) => {
    return new Promise((resolve, _reject) => {
      resolve({ status: 'ok' });
    });
  },
});

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
  expect(text).toBe('Invalid token');
});
