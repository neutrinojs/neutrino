# Neutrino stylelint Middleware

`@neutrinojs/stylelint` is Neutrino middleware for linting styles using stylelint.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/stylelint` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/stylelint
```

#### npm

```bash
❯ npm install --save @neutrinojs/stylelint
```

## Usage

`@neutrinojs/stylelint` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const stylelint = require('@neutrinojs/stylelint');

// Usage shows default values
neutrino.use(stylelint, {
  pluginId: 'stylelint',
  files: '**/*.+(css|scss|sass|less)',
  context: neutrino.options.source,
  failOnError: neutrino.options.command !== 'start'
});
```
Options are passed to `stylelint-webpack-plugin`. See the [stylelint Node API](https://stylelint.io/user-guide/node-api/#options) for all available options.

## Information

By default this middleware will show errors and warnings in the console during development, and will cause a failure when
creating a build bundle.

## stylelint CLI

_This is the recommended way to perform a one-off lint in a Neutrino project._

You can also have Neutrino invoke stylelint for you if you wish to perform a one-time lint. This avoids needing to install
stylelint manually, creating a `.stylelint.js` file, or having to manage includes and ignores. As long as the stylelint
middleware is loaded, you have access to a command to run stylelint from the command line.

This middleware registers a command named `stylelint` which programmatically calls stylelint and prints the results to
the console.

```bash
❯ neutrino stylelint
```

```bash
❯ neutrino stylelint --fix
```

## stylelintrc Config

If you cannot or do not wish to use Neutrino to execute one-off linting, you can still use stylelint manually.

`@neutrinojs/stylelint` also provides a method for getting the stylelint configuration suitable for use in a stylelintrc
file. Typically this is used for providing hints or fix solutions to the development environment, e.g. IDEs and text
editors. Doing this requires [creating an instance of the Neutrino API](https://neutrino.js.org/api) and providing the
middleware it uses. If you keep all this information in a `.neutrinorc.js`, this should be relatively straightforward. By
providing all the middleware used to Neutrino, you can ensure all the linting options used across all middleware will be
merged together for your development environment, without the need for copying, duplication, or loss of organization and
separation.

This middleware registers another command named `stylelintrc` which returns a stylelint configuration object suitable for
consumption by the stylelint CLI. Use the Neutrino API's `call` method to invoke this command:

_Example: Create a .stylelintrc.js file in the root of the project, using `.neutrinorc.js` middleware._

```js
// .stylelintrc.js
const { Neutrino } = require('neutrino');

// Specify middleware to Neutrino prior to calling stylelintrc.
// Even if using .neutrinorc.js, you must specify it when using
// the API
module.exports = Neutrino()
  .use('.neutrinorc.js')
  .call('stylelintrc');
```

_Example: Create a .stylelintrc.js file in the root of the project, using specified middleware._

```js
// .stylelintrc.js
const { Neutrino } = require('neutrino');

module.exports = Neutrino()
  .use('@neutrinojs/stylelint', {
    config: {
      rules: { 'max-empty-lines': 2 }
    }
  })
  .call('stylelint');
```

If you are able, only use a `.stylelint.js` file for editor hints, and use the Neutrino `stylelint` command for one-off linting
or fixes. **Loading stylelint configuration from `.stylelint.js` that is not `.neutrinorc.js` or uses configuration that
differs from `.neutrinorc.js` could lead to unintended consequences such as linting not failing or passing when expected,
or working differently when running different commands. Closely evaluate whether you _actually_ need to make these rule
changes in `.stylelint.js` over `.neutrinorc.js`.**

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/stylelint.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/stylelint.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/stylelint
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
