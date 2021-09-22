# Testing Stripes UI modules with Jest and RTL

Mike Taylor, Index Data

22 September 2019

<!-- md2toc -l 2 testing-with-jest-and-rtl.md -->
* [Introduction](#introduction)
* [Configuring Jest](#configuring-jest)
    * [Support for ES6](#support-for-es6)
    * [Reporting test coverage](#reporting-test-coverage)
    * [Support for DOM assertions](#support-for-dom-assertions)
    * [Establishing mocks](#establishing-mocks)
* [Configuring ESLint: overrides for Jest tests](#configuring-eslint-overrides-for-jest-tests)
* [Configuring Jenkins: running tests in CI](#configuring-jenkins-running-tests-in-ci)
* [Detritus](#detritus)



## Introduction

The preferred toolset for creating unit tests for Striper UI
modules such as `ui-plugin-eusage-reports` is currently
[the Jest framework](https://jestjs.io/)
with React interaction provided by
[RTL (React Testing Library)](https://testing-library.com/docs/react-testing-library/intro)
and mocks for back-end interaction provided by Jest itself (rather than
[Mock Service Worker](https://mswjs.io/)
as suggested in
[the RTL Example page](https://testing-library.com/docs/react-testing-library/example-intro).)

There is quite a ciomplex of different modules and condfigurations required to make this work. Rather than cargo-culting this process by blindly copying a setup from another module that seems to work, it seemed better to make some effort to understand what is required. This document tries to summarise the key points and give an overview.

**WARNING.** Everything in this document has been inferred from what seems to work, what breaks when certain things are absent, and relevant excepts from online doccumentation. It was not written by an expert but by a novice (since the experts don't seem to have written such a document). For this reason **everything in the document should be taken with a pinch of salt**.



## Configuring Jest

While the Jest home page features the admirable goal "Jest aims to work out of the box, config free, on most JavaScript projects", rather more is necessary for it to work in a Stripes module. The principal configuration file is [`jest.config.js`](../jest.config.js) at the top level, a short JavaScript program that exports a JSON object with the generated configuration. The format of this file is [well documented on the Jest site](https://jestjs.io/docs/configuration).

This file refers to several files and modules outside itself, and we conventionally keep all these additional parts of the configuration in the [`test/jest`](../test/jest) directory. We will now review the most important entries in the Jest configuration and the files that they use.


### Support for ES6

Babel is used to support the modern JavaScript dialect ES6. This is achieved by the `transform` directive, which specifies that files whose names end in `.js` or `.jsx` are handled by the transformer defined by [`test/jest/jest-transformer.js`](../test/jest/jest-transformer.js). This short file uses the adapter module [`babel-jest`](https://www.npmjs.com/package/babel-jest) to make Babel function as a Jest transformer, and configures it with the Stripes configuration exported from the additional configuration file [`test/jest/babel.config.js`](../test/jest/babel.config.js). This file in turn gets that configuration from the Stripes CLI module and re-exports it (and so could probably ebe eliminated).

* Dependencies: `babel-jest`, `@folio/stripes-cli`

**NOTE.** I am not clear on why we get the Stripes CLI configuration from the Stripes CLI instead of directly from `stripes-webpack`.


### Reporting test coverage

Jest can report test coverage just be providing the `--coverage` command-line option, but it needs to be told:
* which files to collect coverage information from, in the `collectCoverageFrom` element
* how to emit the results of coverage analysis, in the `coverageReporters`. The value `['lcov', 'text']` says to store in the lcov format used by FOLIO's CI system and also emit a summary of the results as text.
* where to store the coverage analysis results, in the `coverageDirectory` element.


### Support for DOM assertions

The `setupFiles` and `setupFilesAfterEnv` configuration elements are used to execute specified scripts before each test -- the former before the testing framework is installed in the environment, and the latter after.

We use `setupFilesAfterEnv` to run another file, [`test/jest/jest.setup.js`](../test/jest/jest.setup.js). All this does is import `@testing-library/jest-dom` which provides Jest matchers for DOM elements, enabling you to say things like `expect(form).toBeVisible()`.

* Dependencies: `@testing-library/jest-dom`


### Establishing mocks

*NOTE.* I am not yet using mocks, so my understanding here may well be off.

We use `setupFiles` to run [`test/jest/setupTests.js`](../test/jest/setupTests.js), which in turn installs all the specific mocks provided in the oddly named [`test/jest/__mock__`](../test/jest/__mock__) directory -- which will vary by project -- as well as the misleadingly named `regenerator-runtime` module, which implements `async` for Babel. `setupFiles` also pulls in `jest-canvas-mock`, which mocks the canvas element.

We also use `moduleNameMapper`, for reasons I do not properly understand, to mock CSS and SVG files using thw `identity-obj-proxy` module.

* Dependencies: `regenerator-runtime`, `jest-canvas-mock`, `identity-obj-proxy`



## Configuring ESLint: overrides for Jest tests

Tests written for Jest include some aspects that are usually flagged as errors by ESLint -- for example, use of global functions such as `test` and `expect`. To keep lint-clean, we can instruct ESLint to override its usual rules for files matching `*.test.js` by using the `jest` environment when linting them. Add this clause to the top-level `.eslintrc`:

	"overrides": [
	  {
	    "files": "**/*.test.js",
	    "env": {
	      "jest": true
	    }
	  }
	]



## Configuring Jenkins: running tests in CI

Once you have your tests running, you want them to run automatically in CI. Assuming your project is set up in the standard way in the FOLIO Jenkins system, all you need to do is add these lines to your `Jenkinsfile`:

	runTest = 'yes'
	runTestOptions = '--coverage'

The CI configuration knows to find the coverasge analysis results in `artifacts/coverage-jest`, which is where the Jest configuration says to leave them, so coverage artifacts should just appear in Jenkins.



## Detritus

For some reasons, running Jest leaves behind a `junit.xml` file, which can be safely ignored and should be omitted from the version-control repository.


