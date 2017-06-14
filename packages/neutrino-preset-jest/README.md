# Neutrino Jest Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-jest` is a Neutrino preset that supports testing JavaScript projects with the Jest test runner.

## Features

- Zero upfront configuration necessary to start testing
- Babel compilation that compiles your tests using the same Babel options used by your source code
- Source watching for re-running of tests on change
- Collecting test coverage information and generating report
- Easily extensible to customize your testing as needed

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6, Neutrino build preset

## Installation

`neutrino-preset-jest` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-jest` are development dependencies. You will also be using
another Neutrino preset for building your application source code.

#### Yarn

```bash
❯ yarn add --dev neutrino-preset-jest
```

#### npm

```bash
❯ npm install --save-dev neutrino-preset-jest
```

### Installation: React Testing

Jest is often used in the testing of React components. If you are using this preset in a React application, which most
likely means you are using `neutrino-preset-react`, you should also consider adding React's TestUtils and potentially a
higher-level abstraction such as Airbnb's Enzyme. These should be development dependencies of your project.

#### Yarn

```bash
❯ yarn add --dev react-addons-test-utils enzyme
```

#### npm

```bash
❯ npm install --save-dev react-addons-test-utils enzyme
```

See the [React's Test Utils documentation](https://facebook.github.io/react/docs/test-utils.html) for specifics on React
testing with this approach.

## Project Layout

`neutrino-preset-jest` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project test code should live in a directory named `test` in the root of the
project. Test files end in either `_test.js`, `.test.js`, `_test.jsx`, or `.test.jsx`.

## Quickstart

After adding the Jest preset to your Neutrino-built project, add a new directory named `test` in the root of the
project, with a single JS file named `simple_test.js` in it.

```bash
❯ mkdir test && touch test/simple_test.js
```

Edit your `test/simple_test.js` file with the following:

```js
describe('simple', () => {
  it('should be sane', () => {
    expect(false).not.toBe(true);
  });
});
```

Now edit your project's package.json to add commands for testing your application. In this example,
let's pretend this is a Node.js project:

```json
{
  "scripts": {
    "test": "neutrino test --use neutrino-preset-node neutrino-preset-jest"
  }
}
```

Or if you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: [
    'neutrino-preset-node',
    'neutrino-preset-jest'
  ]
};
```

Run the tests, and view the results in your console:

#### Yarn

```bash
❯ yarn test
 PASS  test/simple_test.js
  simple
    ✓ should be sane (2ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.936s
Ran all test suites.
✨  Done in 2.12s.
```

#### npm

```bash
❯ npm test

 PASS  test/simple_test.js
  simple
    ✓ should be sane (2ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.972s
Ran all test suites.
```

To run tests against files from your source code, simply import them:

```js
import thingToTest from '../src/thing';
```

For more details on specific Jest usage, please refer to their [documentation](https://facebook.github.io/jest/).

## Executing single tests

By default this preset will execute every test file located in your test directory ending in the appropriate file
extension. Use the command line [`files` parameters](https://neutrino.js.org/cli#neutrino-test) to execute individual tests.

## Watching for changes

`neutrino-preset-jest` can watch for changes on your source directory and subsequently re-run tests. Simply use the
`--watch` flag with your `neutrino test` command.

## Coverage reporting

Jest has an integrated coverage reporter, which requires no configuration. To collect test coverage information and
generate a report:

```bash
❯ neutrino test --coverage
```

You can also edit your package.json file and create a separate command for generating a coverage report, which can be
helpful during continuous integration of your project:

```json
{
  "scripts": {
    "coverage": "neutrino test --coverage"
  }
}
```

See the [Jest documentation](https://facebook.github.io/jest/docs/configuration.html#collectcoveragefrom-array) for
more configuration options for generating coverage reports.

## Preset options

You can provide custom options and have them merged with this preset's default options, which are subsequently passed
to Jest. You can modify Jest settings from `.neutrinorc.js` by overriding with any options Jest accepts. In a standalone
Jest project this is typically done in the package.json file, but `neutrino-preset-jest` allows configuration through
this mechanism as well. This accepts the same configuration options as outlined in the
[Jest documentation](https://facebook.github.io/jest/docs/configuration.html). Use an array pair instead of a string
to supply these options.

_Example: Turn off bailing on test failures._

```js
module.exports = {
  use: [
    ['neutrino-preset-jest', { bail: false }]
  ]
};
```

## Customizing

To override the test configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-jest` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `compile` | Compiles JS files from the `test` directory using adopted Babel settings from other build presets. Contains a single loader named `babel`. | all |

### Override configuration

By following the [customization guide](https://neutrino.js.org/customization) and knowing the rule, and loader IDs above,
you can override and augment testing by providing a function to your `.neutrinorc.js` use array. You can also
make this change from the Neutrino API when using the `use` method.

In a standalone Jest project this is typically done in the package.json file, but `neutrino-preset-jest` allows
configuration through this mechanism as well. This accepts the same configuration options as outlined in the
[Jest documentation](https://facebook.github.io/jest/docs/configuration.html). Use an array pair instead of a string
to supply these options.

_Example: Add a custom Babel plugin when testing:_

```js
module.exports = {
  use: [
    'neutrino-preset-jest'
  ],
  env: {
    NODE_ENV: {
      test: (neutrino) => neutrino.config.module
        .rule('compile')
        .use('babel')
        .tap(options => merge(options, {
          env: {
            test: {
              plugins: ['custom-babel-plugin']
            }
          }
        }))
    }
  }
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-jest.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-jest.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-jest
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
