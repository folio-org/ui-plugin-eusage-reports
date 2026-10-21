// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const config = require('@folio/jest-config-stripes');

// keyboardjs — pulled in transitively by @folio/stripes-components (HotKeys) —
// now ships untranspiled ESM, so importing @folio/stripes/core throws "Cannot
// use import statement outside a module" unless Jest transforms it. A file is
// ignored if it matches ANY ignore pattern, so we must widen the base
// negative-lookahead allow-list rather than add a new pattern.
const transformIgnorePatterns = config.transformIgnorePatterns.map(
  pattern => pattern.replace('node_modules/(?!', 'node_modules/(?!keyboardjs|'),
);

module.exports = {
  ...config,
  transformIgnorePatterns,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
};
