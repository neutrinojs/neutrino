# Neutrino Mocha Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-mocha` is a Neutrino preset that supports testing JavaScript projects with the Mocha test runner.

## Features

- Zero upfront configuration necessary to start testing
- Babel compilation that compiles your tests using the same Babel options used by your source code
- Easily extensible to customize your testing as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5, Neutrino build preset

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

`neutrino-preset-mocha` follows the standard [project layout](/project-layout.md) specified by Neutrino. This
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
    "test": "neutrino test --presets neutrino-preset-node neutrino-preset-mocha"
  }
}
```

Or if you have set up Neutrino with `neutrino.presets` in your package.json:

```json
{
  "neutrino": {
    "presets": [
      "neutrino-preset-node",
      "neutrino-preset-mocha"
    ]
  }
}
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
Use the command line [`files` parameters](/cli/README.md#neutrino-test) to execute individual tests.

## Customizing

To override the test configuration, start with the documentation on [customization](/customization/README.md).
`neutrino-preset-mocha` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `compile`: Compiles JS files from the `test` directory using Babel. Contains a single loader named `babel`. Adopts
Babel configuration from other presets that have been loaded.

### Simple customization

By following the [customization guide](/customization/simple.md) you can override and augment the test configuration
directly from package.json. `neutrino-preset-mocha` will import Mocha configuration from your package.json's
`neutrino.options.mocha` object if defined. The format is defined on the
[Mocha documentation site](https://mochajs.org/#usage), with command-line flags mapping to camel-cased options
in `neutrino.options.mocha`.

### Advanced configuration

By following the [customization guide](/customization/advanced.md) and knowing the rule, and loader IDs above,
you can override and augment testing by creating a JS module which overrides the config.

You can modify Mocha settings by overriding the preset with any options Mocha accepts. This is stored in the
`neutrino.custom.mocha` object.

_Example: Switch the test reporter from the default `spec` to `nyan`:_

```js
module.exports = neutrino => {
  neutrino.options.mocha.reporter = 'nyan';
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

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](/contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-mocha.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-mocha.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-mocha
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
