// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const esModules = ['@folio', 'ky'].join('|');

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!test/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: './artifacts/coverage-jest/',
  coverageReporters: ['lcov', 'text'],
  reporters: ['jest-junit', 'default'], // XXX try this different ways
  transform: { '^.+\\.(js|jsx)$': path.join(__dirname, './test/jest/jest-transformer.js') },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^.+\\.(css)$': 'identity-obj-proxy',
    '^.+\\.(svg)$': 'identity-obj-proxy',
  },
  testMatch: ['**/src/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: [
    path.join(__dirname, './test/jest/setupTests.js'),
    'jest-canvas-mock'
  ],
  setupFilesAfterEnv: [path.join(__dirname, './test/jest/jest.setup.js')],
};
