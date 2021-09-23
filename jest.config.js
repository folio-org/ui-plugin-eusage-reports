// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const esModules = ['@folio', 'ky'].join('|');

module.exports = {
  // Testing basics
  testMatch: ['**/src/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  reporters: ['jest-junit', 'default'],

  // Support for ES6
  transform: { '^.+\\.(js|jsx)$': path.join(__dirname, './test/jest/jest-transformer.js') },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],

  // Reporting test coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!test/**',
    '!**/node_modules/**',
    '!src/util/myUseMemo.js',
  ],
  coverageReporters: ['lcov', 'text'],
  coverageDirectory: './artifacts/coverage-jest/',

  // Support for DOM assertions
  setupFilesAfterEnv: [path.join(__dirname, './test/jest/jest.setup.js')],

  // Establishing mocks
  setupFiles: [
    path.join(__dirname, './test/jest/setupTests.js'),
    'jest-canvas-mock'
  ],
  moduleNameMapper: {
    '^.+\\.(css)$': 'identity-obj-proxy',
    '^.+\\.(svg)$': 'identity-obj-proxy',
  },
};
