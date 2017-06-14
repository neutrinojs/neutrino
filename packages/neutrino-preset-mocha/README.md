# Neutrino Mocha Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-mocha` is a Neutrino preset that supports testing JavaScript projects with the Mocha test runner.

## Features

- Zero upfront configuration necessary to start testing
- Babel compilation that compiles your tests using the same Babel options used by your source code
- Easily extensible to customize your testing as needed

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6, Neutrino build preset

## Installation

`neutrino-preset-mocha` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-mocha` are development dependencies. You will also be using
another Neutrino preset for building your application source code.

#### Yarn

```bash
❯ yarn add --dev neutrino-preset-mocha
```

#### npm

```bash
❯ npm install --save-dev neutrino-preset-mocha
```

## Project Layout

`neutrino-preset-mocha` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project test code should live in a directory named `test` in the root of the
project. Test files end in `_test.js` by default.

## Quickstart

After adding the Mocha preset to your Neutrino-built project, add a new directory named `test` in the root of the
project, with a single JS file named `simple_test.js` in it.

```bash
❯ mkdir test && touch test/simple_test.js
```

Edit your `test/simple_test.js` file with the following:

```js
import assert from 'assert';

describe('simple', () => {
  it('should be sane', () => {
    assert.equal(true, !false);
  });
});
```

Now edit your project's package.json to add commands for testing your application. In this example,
let's pretend this is a Node.js project:

```json
{
  "scripts": {
    "test": "neutrino test --use neutrino-preset-node neutrino-preset-mocha"
  }
}
```

Or if you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: [
    'neutrino-preset-node',
    'neutrino-preset-mocha'
  ]
};
```

Run the tests, and view the results in your console:

#### Yarn

```bash
❯ yarn test

  simple
    ✓ should be sane


  1 passing (426ms)

✨  Done in 4.17s.
```

#### npm

```bash
❯ npm test

  simple
    ✓ should be sane


  1 passing (409ms)
```

To run tests against files from your source code, simply import them:

```js
import thingToTest from '../src/thing';
```

For more details on specific Mocha usage, please refer to their [documentation](http://mochajs.org/).

## Executing single tests

By default this preset will execute every test file located in your test directory ending in `_test.js`.
Use the command line [`files` parameters](https://neutrino.js.org/cli#neutrino-test) to execute individual tests.

## Preset options

You can provide custom options and have them merged with this preset's default options, which are subsequently passed
to Mocha. You can modify Mocha settings from `.neutrinorc.js` by overriding with any options Mocha accepts. In a standalone
Mocha project this is typically done from a `mocha.opts` file, but `neutrino-preset-mocha` allows configuration through
`.neutrinorc.js`. This accepts the same options specified by Mocha defined on the
[Mocha documentation site](https://mochajs.org/#usage), with command-line flags mapping to camel-cased options.
Use an array pair instead of a string to supply these options in `.neutrinorc.js`.

_Example: Switch the test reporter from the default `spec` to `nyan`:_

```js
module.exports = {
  use: [
    ['neutrino-preset-mocha', { reporter: 'nyan' }]
  ]
};
```

```bash
❯ yarn test

 1   -__,------,
 0   -__|  /\_/\
 0   -_~|_( ^ .^)
     -_ ""  ""

  1 passing (362ms)

✨  Done in 3.28s.
```

## Customizing

To override the test configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-mocha` creates some conventions to make overriding the configuration easier once you are ready to make
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

In a standalone Mocha project this is typically done in a `mocha.opts` file, but `neutrino-preset-mocha` allows
configuration through `.neutrinorc.js`. This accepts the same options specified by Mocha defined on the
[Mocha documentation site](https://mochajs.org/#usage), with command-line flags mapping to camel-cased options. Use an
array pair instead of a string to supply these options.

_Example: Add a custom Babel plugin when testing:_

```js
module.exports = {
  use: [
    'neutrino-preset-mocha'
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

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-mocha.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-mocha.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-mocha
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
