import ReactDOMServer from 'react-dom/server';
import performLongOperation from './performLongOperation';

const okapiKy = {
  post: (path) => {
    return new Promise((resolve, reject) => {
      if (path === '/good') {
        resolve();
      } else {
        reject(new Error('bad houses'));
      }
    });
  },
};

const savedCalloutMessages = [];
const callout = {
  sendCallout: (x) => savedCalloutMessages.push(x),
};
function resetCalloutMessages() {
  // Who would have thought ESLint would let me get away with this? :-)
  while (savedCalloutMessages.pop());
}

function checkMessages(calloutMessages, expected) {
  expect(calloutMessages.length).toBe(expected.length);
  expected.forEach((token, i) => {
    const translated = ReactDOMServer.renderToString(calloutMessages[i].message);
    expect(translated).toBe(`ui-plugin-eusage-reports.button.update-matches.${token[0]}`);
    expect(calloutMessages[i].type).toBe(token[1] ? 'error' : undefined);
  });
}

test('performs a successful long operation', async () => {
  await performLongOperation(okapiKy, callout, 'update-matches', '/good', {}, { foo: 42 }, () => {});
  checkMessages(savedCalloutMessages, [['dispatched'], ['completed']]);
});

test('performs an unsuccessful long operation', async () => {
  resetCalloutMessages();
  await performLongOperation(okapiKy, callout, 'update-matches', '/bad', {}, { foo: 42 });
  checkMessages(savedCalloutMessages, [['dispatched'], ['error', true]]);
});
