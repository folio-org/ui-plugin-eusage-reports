import displayError from './displayError';

let reportedError;
const callout = {
  sendCallout: (x) => { reportedError = x; },
};

test('displays an error with hardwired message', () => {
  expect(reportedError).toBeUndefined();

  const message = 'customer on fire';
  displayError(callout, 'button.update-matches.error', undefined, message);

  expect(reportedError).toBeDefined();
  expect(reportedError.type).toBe('error');

  expect(reportedError.message).toBeDefined();
  expect(typeof reportedError.message).toBe('object');

  expect(reportedError.message.props).toBeDefined();
  expect(typeof reportedError.message.props).toBe('object');

  expect(reportedError.message.props.id).toBeDefined();
  expect(typeof reportedError.message.props.id).toBe('string');

  expect(reportedError.message.props.values).toBeDefined();
  expect(typeof reportedError.message.props.values).toBe('object');

  expect(reportedError.message.props.values.error).toBeDefined();
  expect(typeof reportedError.message.props.values.error).toBe('string');
  expect(reportedError.message.props.values.error).toBe(message);
});

test('displays an error with a translated message', () => {
  displayError(callout, 'button.update-matches.error', 'no-tr-report');

  expect(reportedError).toBeDefined();
  // No need to pedantically walk the structure as we did in the first test
  expect(typeof reportedError.message.props.values.error).toBe('object');
  // Oddly, there is no simple way to obtain the actual translated text
});

